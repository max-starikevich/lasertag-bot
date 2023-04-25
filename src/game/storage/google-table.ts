import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { decode } from 'html-entities'
import { groupBy } from 'lodash'

import { RangeParsed, extractString } from '$/utils'
import { NoSheetsError } from '$/errors/NoSheetsError'
import { getLocaleByName } from '$/lang/i18n-custom'

import { GameStorage } from './types'
import { Player, UpdatedPlayer } from '../player/types'
import { GameLink, GameLocation } from '../types'
import { getPlayerCells } from './utils'

export const playerFields: Array<keyof Player> = ['telegramUserId', 'locale']
export const enrollFields: Array<keyof Player> = ['count', 'rentCount']

export interface PlayersData {
  docId: string
  sheetsId: string
  sheets?: GoogleSpreadsheetWorksheet
}

export interface GameData extends PlayersData {}

export interface LinksData extends PlayersData {}

export interface EnrollData extends PlayersData {
  namesRange: RangeParsed
  countRange: RangeParsed
  rentRange: RangeParsed
}

export class GoogleTableGameStorage implements GameStorage {
  constructor (
    protected email: string,
    protected privateKey: string,

    protected players: PlayersData,
    protected game: GameData,
    protected links: LinksData,
    protected enroll: EnrollData
  ) {}

  init = async (): Promise<void> => {
    try {
      const docToSheetMap = {
        [this.players.docId]: this.players.sheetsId,
        [this.game.docId]: this.game.sheetsId,
        [this.links.docId]: this.links.sheetsId,
        [this.enroll.docId]: this.enroll.sheetsId
      }

      const docs = Object.keys(docToSheetMap).map(docId => new GoogleSpreadsheet(docId))

      await Promise.all(docs.map(async doc =>
        await doc.useServiceAccountAuth({
          client_email: this.email,
          private_key: this.privateKey
        }).then(async () => await doc.loadInfo())
      ))

      this.players.sheets = docs.find(doc => doc.spreadsheetId === this.players.docId)?.sheetsById[this.players.sheetsId]
      this.game.sheets = docs.find(doc => doc.spreadsheetId === this.game.docId)?.sheetsById[this.game.sheetsId]
      this.links.sheets = docs.find(doc => doc.spreadsheetId === this.links.docId)?.sheetsById[this.links.sheetsId]
      this.enroll.sheets = docs.find(doc => doc.spreadsheetId === this.enroll.docId)?.sheetsById[this.enroll.sheetsId]
    } catch (e) {
      if (e instanceof NoSheetsError) {
        throw e
      }

      throw new NoSheetsError(e)
    }
  }

  getPlayers = async (): Promise<Player[]> => {
    if (this.players.sheets === undefined) {
      throw new NoSheetsError()
    }

    const players = (await this.players.sheets.getRows())
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
    if (this.game.sheets === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.game.sheets.getRows()

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
    if (this.links.sheets === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.links.sheets.getRows()

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

  savePlayer = async (player: UpdatedPlayer): Promise<UpdatedPlayer> => {
    if (this.players.sheets === undefined || this.enroll.sheets === undefined) {
      throw new NoSheetsError()
    }

    const map = await getPlayerCells(player, this.players, this.enroll)

    for (const playerField of Object.keys(player)) {
      const fieldName = playerField as keyof Player
      const cell = map[fieldName]

      if (cell === undefined) {
        continue
      }

      const nextValue = player[fieldName]

      if (nextValue === undefined || nextValue === cell.value) {
        continue
      }

      cell.value = nextValue ?? ''
    }

    await Promise.all([
      this.players.sheets.saveUpdatedCells(),
      this.enroll.sheets.saveUpdatedCells()
    ])

    return player
  }
}
