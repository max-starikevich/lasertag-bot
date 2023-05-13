import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { decode } from 'html-entities'
import { groupBy, intersection, range } from 'lodash'
import NodeCache from 'node-cache'

import { extractString, parseRange } from '$/utils'
import { getLocaleByName } from '$/lang/i18n-custom'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { EnrollData, GameData, GoogleSpreadsheetCellMap, GoogleTableGameStorageParams, LinksData, PlayersData, SheetsData, StatsData } from './types'
import { Player, ScoredTeams } from '../../player/types'
import { GameLink, GameLocation } from '../../types'
import { GameStorage } from '../types'

export class GoogleTableGameStorage implements GameStorage {
  protected documentMap: { [docId: string]: GoogleSpreadsheet } = {}
  protected playersCache = new NodeCache({ stdTTL: 120 })

  protected email: string
  protected privateKey: string

  protected players: PlayersData
  protected game: GameData
  protected links: LinksData
  protected stats: StatsData
  protected enroll: EnrollData

  constructor (params: GoogleTableGameStorageParams) {
    this.email = params.email
    this.privateKey = params.privateKey
    this.players = params.players
    this.game = params.game
    this.links = params.links
    this.stats = params.stats

    const { ranges } = params.enroll

    this.enroll = {
      docId: params.enroll.docId,
      sheetsId: params.enroll.sheetsId,
      ranges: {
        names: parseRange(ranges.names),
        count: parseRange(ranges.count),
        rent: parseRange(ranges.rent),
        comment: parseRange(ranges.comment)
      }
    }
  }

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

  getPlayers = async (updateId?: number): Promise<Player[]> => {
    if (updateId !== undefined) {
      const cache = this.playersCache.get<Player[]>(updateId)

      if (cache !== undefined) {
        return cache
      }
    }

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

    const processedPlayers = players.map(p => {
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

    if (updateId !== undefined) {
      this.playersCache.set<Player[]>(updateId, processedPlayers)
    }

    return processedPlayers
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
    const cellMap = await this.buildPlayerCellMap(name, fieldsToSave)

    for (const playerField of Object.keys(fieldsToSave)) {
      const fieldName = playerField as keyof Player
      const cell = cellMap[fieldName]

      if (cell === undefined) {
        continue
      }

      const nextValue = fieldsToSave[fieldName]

      if (nextValue === undefined || nextValue === cell.value) {
        continue
      }

      cell.value = nextValue ?? ''
    }

    const players = await this.getSheets(this.players)
    const enroll = await this.getSheets(this.enroll)

    await Promise.all([
      players.saveUpdatedCells(),
      enroll.saveUpdatedCells()
    ])
  }

  protected buildPlayerCellMap = async (
    name: string,
    fieldsToSave: Partial<Player>
  ): Promise<GoogleSpreadsheetCellMap> => {
    const playerFields: Array<keyof Player> = ['telegramUserId', 'locale']
    const enrollFields: Array<keyof Player> = ['count', 'rentCount', 'comment']

    const map: GoogleSpreadsheetCellMap = {}

    if (intersection(Object.keys(fieldsToSave), playerFields).length > 0) {
      const sheets = await this.getSheets(this.players)
      const playerRow = (await sheets.getRows()).find(row => row.name === name)

      if (playerRow === undefined) {
        throw new Error('Couldn\'t find the player\'s row in the player sheets.')
      }

      const headers: string[] = sheets.headerValues
      const rowIndex = playerRow.rowIndex - 1

      await sheets.loadCells([`${sheets.a1SheetName}!A1:Z1`, playerRow.a1Range])

      headers.forEach((headerName, columnIndex) => {
        const playerFieldName = headerName as keyof Player

        if (!playerFields.includes(playerFieldName)) {
          return
        }

        map[playerFieldName] = sheets.getCell(rowIndex, columnIndex)
      })
    }

    if (intersection(Object.keys(fieldsToSave), enrollFields).length > 0) {
      const sheets = await this.getSheets(this.enroll)
      const ranges = this.enroll.ranges

      await sheets.loadCells([
        ranges.names.raw,
        ranges.count.raw,
        ranges.rent.raw,
        ranges.comment.raw
      ])

      const nameCell = range(ranges.names.from.num, ranges.names.to.num)
        .map(n => sheets.getCellByA1(`${ranges.names.from.letter}${n}`))
        .find(cell => {
          if (cell.value === name) {
            return true
          }

          return false
        })

      if (nameCell === undefined) {
        throw new Error('Can\'t find player\'s name cell in the enroll table')
      }

      const rowNumber = nameCell.rowIndex + 1

      map.name = nameCell
      map.count = sheets.getCellByA1(`${ranges.count.from.letter}${rowNumber}`)
      map.rentCount = sheets.getCellByA1(`${ranges.rent.from.letter}${rowNumber}`)
      map.comment = sheets.getCellByA1(`${ranges.comment.from.letter}${rowNumber}`)
    }

    return map
  }

  saveStats = async (teams: ScoredTeams): Promise<void> => {
    console.log({
      teams
    })

    const sheets = await this.getSheets(this.stats)
    await sheets.saveUpdatedCells()
  }
}
