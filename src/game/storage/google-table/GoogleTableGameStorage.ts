import { GoogleSpreadsheet, GoogleSpreadsheetCell, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { decode } from 'html-entities'
import { groupBy, omitBy, range } from 'lodash'

import config from '$/config'
import { extractNumber, extractString, parseRange } from '$/utils'
import { extractLocale } from '$/lang/i18n-custom'
import { GoogleDocumentError } from '$/errors/GoogleDocumentError'
import { StatsAlreadySavedError } from '$/errors/StatsAlreadySavedError'
import { reportException } from '$/errors'

import { EnrollData, GameData, GoogleSpreadsheetPlayerCellMap, GoogleTableGameStorageParams, LinksData, PlayersData, STATS_DATE_FORMAT, SheetsData, StatsData, StatsResult } from './types'
import { GameStatsData, Player, Role } from '../../player/types'
import { GameLink, GameLocation } from '../../types'
import { GameStorage } from '../types'
import { assertRows, getCellsByRow, getCellsByRows, getDateByTimestamp } from './utils'
import { extractRole } from '../../player'

export class GoogleTableGameStorage implements GameStorage {
  protected email: string
  protected privateKey: string

  protected players: PlayersData
  protected game: GameData
  protected links: LinksData
  protected stats: StatsData
  protected enroll: EnrollData

  protected documentMap: { [docId: string]: GoogleSpreadsheet } = {}

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

  public getStatsTimezone (): string {
    return this.stats.timezone
  }

  protected async getSheets ({ docId, sheetsId }: SheetsData): Promise<GoogleSpreadsheetWorksheet> {
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
      throw new GoogleDocumentError(`Missing sheets with id ${sheetsId} in document ${docId}`)
    }

    return sheets
  }

  public async getPlayers (): Promise<Player[]> {
    const sheets = await this.getSheets(this.players)
    const rows = await sheets.getRows()

    assertRows(rows)

    const players = rows
      .reduce<Player[]>((players, row) => {
      const name = decode(row.name)

      if (name.length === 0) {
        return players
      }

      const telegramUserId = extractNumber(row.telegramUserId)

      const count = extractNumber(row.count) ?? 0
      const isQuestionableCount = extractString(row.count)?.includes('?') ?? false

      const rentCount = extractNumber(row.rentCount) ?? 0
      const isQuestionableRentCount = extractString(row.rentCount)?.includes('?') ?? false

      const level = extractNumber(row.level) ?? 0
      const comment = extractString(row.comment)
      const clanName = extractString(row.clanName)
      const locale = extractLocale(row.locale) ?? config.DEFAULT_LOCALE
      const role = extractRole(row.role)

      const player: Player = {
        tableRow: row.rowIndex,
        role,
        isAdmin: role === Role.ADMIN,
        telegramUserId,
        name,
        count,
        rentCount,
        comment,
        level,
        isQuestionableCount,
        isQuestionableRentCount,
        combinedName: count > 1 ? `${name} (${count})` : name,
        clanName,
        clanEmoji: clanName?.match(/\p{Emoji}+/gu)?.[0],
        isClanMember: clanName !== undefined,
        isAlone: true,
        locale,
        wins: extractNumber(row.wins) ?? 0,
        losses: extractNumber(row.losses) ?? 0,
        draws: extractNumber(row.draws) ?? 0,
        gameCount: extractNumber(row.gameCount) ?? 0,
        winRate: extractNumber(row.winRate) ?? 0
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

  public async getLocations (): Promise<GameLocation[]> {
    const sheets = await this.getSheets(this.game)
    const rows = await sheets.getRows()

    assertRows(rows)

    return rows.reduce<GameLocation[]>((result, row) => {
      const lang = extractLocale(row.lang)

      if (lang === undefined) {
        return result
      }

      const location = String(row.location)
      const date = String(row.date)

      return [...result, { location, date, lang }]
    }, [])
  }

  public async getLinks (): Promise<GameLink[]> {
    const sheets = await this.getSheets(this.links)
    const rows = await sheets.getRows()

    assertRows(rows)

    return rows.reduce<GameLink[]>((result, row) => {
      const lang = extractLocale(row.lang)

      if (lang === undefined) {
        return result
      }

      const url = String(row.url)
      const description = String(row.description)

      return [...result, { url, description, lang }]
    }, [])
  }

  public async savePlayer (playerName: string, fieldsToSave: Partial<Player>): Promise<void> {
    const cellMap = await this.getCellMap(playerName)
    const relatedSheets: GoogleSpreadsheetWorksheet[] = []

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

      const relatedSheet = (cell as GoogleSpreadsheetCell & { _sheet: GoogleSpreadsheetWorksheet })._sheet

      if (!relatedSheets.some(sheets => sheets.sheetId === relatedSheet.sheetId)) {
        relatedSheets.push(relatedSheet)
      }
    }

    for (const sheets of relatedSheets) {
      await sheets.saveUpdatedCells()
    }
  }

  protected async getCellMap (
    playerName: string
  ): Promise<GoogleSpreadsheetPlayerCellMap> {
    const playersMap = await this.getPlayersCellMap(playerName)
    const enrollMap = await this.getEnrollCellMap(playerName)

    return {
      ...playersMap,
      ...enrollMap
    }
  }

  protected async getPlayersCellMap (
    playerName: string
  ): Promise<GoogleSpreadsheetPlayerCellMap> {
    const playerFields: Array<keyof Player> = ['telegramUserId', 'locale']
    const sheets = await this.getSheets(this.players)
    const targetRow = (await sheets.getRows()).find(row => row.name === playerName)

    if (targetRow === undefined) {
      throw new Error('Couldn\'t find the player\'s row in the player sheets.')
    }

    const map = await getCellsByRow(sheets, targetRow)

    return omitBy(map, (_v, k) => !playerFields.includes(k as keyof Player))
  }

  protected async getEnrollCellMap (
    playerName: string
  ): Promise<GoogleSpreadsheetPlayerCellMap> {
    const sheets = await this.getSheets(this.enroll)

    const map: GoogleSpreadsheetPlayerCellMap = {}

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
        if (cell.value === playerName) {
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

    return map
  }

  public saveStats = async ({ won, lost, draw, date }: GameStatsData): Promise<void> => {
    const sheets = await this.getSheets(this.stats)
    const dateString = getDateByTimestamp(date, this.stats.timezone).format(STATS_DATE_FORMAT)
    await sheets.loadHeaderRow()

    if (sheets.headerValues.includes(dateString)) {
      throw new StatsAlreadySavedError()
    }

    await sheets.resize({
      rowCount: sheets.rowCount,
      columnCount: sheets.columnCount + 1
    })

    await sheets.setHeaderRow([...sheets.headerValues, dateString])

    const rows = await sheets.getRows()
    const cellMaps = await getCellsByRows(sheets, rows)

    type PlayerWithStats = Player & { statsResult: StatsResult, statsCell?: GoogleSpreadsheetCell }

    const playersWithStats: PlayerWithStats[] = [
      ...won.map<PlayerWithStats>(p => ({ ...p, statsResult: StatsResult.WON })),
      ...lost.map<PlayerWithStats>(p => ({ ...p, statsResult: StatsResult.LOST })),
      ...draw.map<PlayerWithStats>(p => ({ ...p, statsResult: StatsResult.DRAW }))
    ].map(p => ({
      ...p,
      statsCell: cellMaps.find(map => map.name.value === p.name)?.[dateString]
    }))

    for (const { statsResult, statsCell, ...p } of playersWithStats) {
      if (statsCell === undefined) {
        reportException(new Error(`Missing writable date cell for ${p.name} (${dateString})`))
        continue
      }

      statsCell.value = statsResult
    }

    await sheets.saveUpdatedCells()
  }
}
