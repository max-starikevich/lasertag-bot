import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { decode } from 'html-entities'
import { groupBy } from 'lodash'

import { extractString } from '$/utils'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { GameStorage } from './types'
import { EditablePlayerFields, Player } from '../player/types'
import { GameLink, GameLocation } from '../types'
import { getCellsMapByRow } from './utils'
import { localeNames } from '../../lang/i18n-custom'

interface GoogleTableConstructorParams {
  spreadsheetId: string
  privateKey: string
  email: string

  playerSheetsId: string
  gameSheetsId: string
  linksSheetsId: string
}

export class GoogleTableGameStorage implements GameStorage {
  protected spreadsheetId: string
  protected privateKey: string
  protected email: string

  protected document?: GoogleSpreadsheet

  protected playerSheetsId: string
  protected playerSheets?: GoogleSpreadsheetWorksheet

  protected gameSheetsId: string
  protected gameSheets?: GoogleSpreadsheetWorksheet

  protected linksSheetsId: string
  protected linksSheets?: GoogleSpreadsheetWorksheet

  constructor ({ spreadsheetId, privateKey, email, playerSheetsId, gameSheetsId, linksSheetsId }: GoogleTableConstructorParams) {
    this.spreadsheetId = spreadsheetId
    this.privateKey = privateKey
    this.email = email

    this.playerSheetsId = playerSheetsId
    this.gameSheetsId = gameSheetsId
    this.linksSheetsId = linksSheetsId
  }

  init = async (): Promise<void> => {
    try {
      const document = new GoogleSpreadsheet(this.spreadsheetId)

      await document.useServiceAccountAuth({
        client_email: this.email,
        private_key: this.privateKey
      })

      await document.loadInfo()

      this.playerSheets = document.sheetsById[this.playerSheetsId]
      this.gameSheets = document.sheetsById[this.gameSheetsId]
      this.linksSheets = document.sheetsById[this.linksSheetsId]

      this.document = document
    } catch (e) {
      if (e instanceof NoSheetsError) {
        throw e
      }

      throw new NoSheetsError(e)
    }
  }

  getPlayers = async (): Promise<Player[]> => {
    if (this.playerSheets === undefined) {
      throw new NoSheetsError()
    }

    const players = (await this.playerSheets.getRows())
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
    if (this.gameSheets === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.gameSheets.getRows()

    return rows.reduce<GameLocation[]>((result, row) => {
      const lang = localeNames.find(localeName => localeName === row.lang)

      if (lang === undefined) {
        return result
      }

      const location = String(row.location)
      const date = String(row.date)

      return [...result, { location, date, lang }]
    }, [])
  }

  getLinks = async (): Promise<GameLink[]> => {
    if (this.linksSheets === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.linksSheets.getRows()

    return rows.reduce<GameLink[]>((result, row) => {
      const lang = localeNames.find(localeName => localeName === row.lang)

      if (lang === undefined) {
        return result
      }

      const url = String(row.url)
      const description = String(row.description)

      return [...result, { url, description, lang }]
    }, [])
  }

  savePlayer = async (player: Player): Promise<Player> => {
    if (this.playerSheets === undefined) {
      await this.init()
    }

    if (this.playerSheets === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.playerSheets.getRows()
    const targetRow = rows.find(row => row.rowIndex === player.tableRow)

    if (targetRow === undefined) {
      throw new Error()
    }

    const cellsMap = await getCellsMapByRow(targetRow)

    for (const fieldName of EditablePlayerFields) {
      const cell = cellsMap[fieldName]

      if (cell === undefined) {
        continue
      }

      const nextValue = player[fieldName] ?? ''

      if (nextValue === cell.value) {
        continue
      }

      cell.value = nextValue
      await cell.save()
    }

    return player
  }
}
