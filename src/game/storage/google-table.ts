import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { decode } from 'html-entities'
import { groupBy } from 'lodash'

import { ParsedRange, extractString } from '$/utils'
import { getLocaleByName } from '$/lang/i18n-custom'

import { GameStorage } from './types'
import { Player } from '../player/types'
import { GameLink, GameLocation } from '../types'
import { getPlayerCells } from './utils'
import { NoSheetsError } from '../../errors/NoSheetsError'

export interface SheetsData { docId: string, sheetsId: string }

export interface PlayersData extends SheetsData {}
export interface GameData extends SheetsData {}
export interface LinksData extends SheetsData {}

export interface EnrollRangesData {
  names: ParsedRange
  count: ParsedRange
  rent: ParsedRange
}

export interface EnrollData extends SheetsData {
  ranges: EnrollRangesData
}

export class GoogleTableGameStorage implements GameStorage {
  protected documentMap: { [docId: string]: GoogleSpreadsheet } = {}

  constructor (
    protected email: string,
    protected privateKey: string,
    protected players: PlayersData,
    protected game: GameData,
    protected links: LinksData,
    protected enroll: EnrollData
  ) {}

  getSheets = async ({ docId, sheetsId }: SheetsData): Promise<GoogleSpreadsheetWorksheet> => {
    if (this.documentMap[docId] === undefined) {
      const document = new GoogleSpreadsheet(docId)

      await document.useServiceAccountAuth({
        client_email: this.email,
        private_key: this.privateKey
      })

      await document.loadInfo()

      this.documentMap[docId] = document
    }

    const document = this.documentMap[docId]
    const sheets = document.sheetsById[sheetsId]

    if (sheets === undefined) {
      throw new NoSheetsError()
    }

    return sheets
  }

  getPlayers = async (): Promise<Player[]> => {
    const sheets = await this.getSheets(this.players)

    const players = (await sheets.getRows())
      .reduce<Player[]>((players, row) => {
      const name = decode(row.name)

      if (name.length === 0) {
        return players
      }

      const rawCount = (row.count ?? '0')
      const count = +(rawCount.replace('?', ''))
      const rentCount = +(row.rentCount ?? '0')
      const level = +(row.level ?? '0')
      const comment = row.comment
      const clanName = extractString(row.clanName)
      const telegramUserId = extractString(row.telegramUserId)
      const locale = extractString(row.locale)

      const player: Player = {
        tableRow: row.rowIndex,
        telegramUserId: telegramUserId !== undefined ? +(telegramUserId) : undefined,
        name,
        count,
        rentCount,
        comment,
        level,
        isQuestionable: rawCount.includes('?'),
        combinedName: count > 1 ? `${name} (${count})` : name,
        clanName,
        clanEmoji: clanName?.match(/\p{Emoji}+/gu)?.[0],
        isClanMember: clanName !== undefined,
        isAlone: true, // will be overriden later
        locale
      }

      return [...players, player]
    }, [])

    const clans = groupBy(
      players.filter(({ isClanMember, count }) => isClanMember && count > 0),
      ({ clanName }) => clanName
    )

    return players.map(p => {
      if (
        p.clanName === undefined ||
        clans[p.clanName] === undefined ||
        clans[p.clanName].length < 2
      ) {
        return p
      }

      return {
        ...p,
        isAlone: false
      }
    })
  }

  getPlaceAndTime = async (): Promise<GameLocation[]> => {
    const sheets = await this.getSheets(this.game)
    const rows = await sheets.getRows()

    return rows.reduce<GameLocation[]>((result, row) => {
      const lang = getLocaleByName(row.lang)

      if (lang === undefined) {
        return result
      }

      const location = String(row.location)
      const date = String(row.date)

      return [...result, { location, date, lang }]
    }, [])
  }

  getLinks = async (): Promise<GameLink[]> => {
    const sheets = await this.getSheets(this.links)
    const rows = await sheets.getRows()

    return rows.reduce<GameLink[]>((result, row) => {
      const lang = getLocaleByName(row.lang)

      if (lang === undefined) {
        return result
      }

      const url = String(row.url)
      const description = String(row.description)

      return [...result, { url, description, lang }]
    }, [])
  }

  savePlayer = async (name: string, fieldsToSave: Partial<Player>): Promise<void> => {
    const playersSheets = await this.getSheets(this.players)
    const enrollSheets = await this.getSheets(this.enroll)

    const map = await getPlayerCells({
      name,
      fieldsToSave,
      players: {
        sheets: playersSheets
      },
      enroll: {
        sheets: enrollSheets,
        ranges: this.enroll.ranges
      }
    })

    for (const playerField of Object.keys(fieldsToSave)) {
      const fieldName = playerField as keyof Player
      const cell = map[fieldName]

      if (cell === undefined) {
        continue
      }

      const nextValue = fieldsToSave[fieldName]

      if (nextValue === undefined || nextValue === cell.value) {
        continue
      }

      cell.value = nextValue ?? ''
    }

    await Promise.all([
      playersSheets.saveUpdatedCells(),
      enrollSheets.saveUpdatedCells()
    ])
  }
}
