import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { decode } from 'html-entities'
import { groupBy } from 'lodash'

import { extractString } from '$/utils'
import { NoSheetsError } from '$/errors/NoSheetsError'
import { getLocaleByName } from '$/lang/i18n-custom'

import { GameStorage } from './types'
import { Player } from '../player/types'
import { GameLink, GameLocation } from '../types'
import { getCellsMapByRow } from './utils'

export const EditablePlayerFields: Array<keyof Player> = ['telegramUserId', 'locale']

interface GoogleTableConstructorParams {
  privateKey: string
  email: string

  playerDocId: string
  playerSheetsId: string

  gameDocId: string
  gameSheetsId: string

  linksDocId: string
  linksSheetsId: string

  enrollDocId: string
  enrollSheetsId: string
}

export class GoogleTableGameStorage implements GameStorage {
  protected privateKey: string
  protected email: string

  protected playerDocId: string
  protected playerSheetsId: string
  protected players?: GoogleSpreadsheetWorksheet

  protected gameDocId: string
  protected gameSheetsId: string
  protected game?: GoogleSpreadsheetWorksheet

  protected linksDocId: string
  protected linksSheetsId: string
  protected links?: GoogleSpreadsheetWorksheet

  protected enrollDocId: string
  protected enrollSheetsId: string
  protected enroll?: GoogleSpreadsheetWorksheet

  constructor ({
    privateKey, email,
    playerDocId, playerSheetsId,
    gameDocId, gameSheetsId,
    linksDocId, linksSheetsId,
    enrollDocId, enrollSheetsId
  }: GoogleTableConstructorParams) {
    this.privateKey = privateKey
    this.email = email

    this.playerDocId = playerDocId
    this.playerSheetsId = playerSheetsId

    this.gameDocId = gameDocId
    this.gameSheetsId = gameSheetsId

    this.linksDocId = linksDocId
    this.linksSheetsId = linksSheetsId

    this.enrollDocId = enrollDocId
    this.enrollSheetsId = enrollSheetsId
  }

  init = async (): Promise<void> => {
    try {
      // if some tables are in the same document, then don't do duplicated objects + requests
      const docSheetMap = {
        [this.playerDocId]: this.playerSheetsId,
        [this.gameDocId]: this.gameSheetsId,
        [this.linksDocId]: this.linksSheetsId,
        [this.enrollDocId]: this.enrollSheetsId
      }

      const docs = Object.keys(docSheetMap).map(docId => new GoogleSpreadsheet(docId))

      await Promise.all(docs.map(async doc =>
        await doc.useServiceAccountAuth({
          client_email: this.email,
          private_key: this.privateKey
        }).then(async () => await doc.loadInfo())
      ))

      this.players = docs.find(doc => doc.spreadsheetId === this.playerDocId)?.sheetsById[this.playerSheetsId]
      this.game = docs.find(doc => doc.spreadsheetId === this.gameDocId)?.sheetsById[this.gameSheetsId]
      this.links = docs.find(doc => doc.spreadsheetId === this.linksDocId)?.sheetsById[this.linksSheetsId]
      this.enroll = docs.find(doc => doc.spreadsheetId === this.enrollDocId)?.sheetsById[this.enrollSheetsId]
    } catch (e) {
      if (e instanceof NoSheetsError) {
        throw e
      }

      throw new NoSheetsError(e)
    }
  }

  getPlayers = async (): Promise<Player[]> => {
    if (this.players === undefined) {
      throw new NoSheetsError()
    }

    const players = (await this.players.getRows())
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
    if (this.game === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.game.getRows()

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
    if (this.links === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.links.getRows()

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

  savePlayer = async (player: Player): Promise<Player> => {
    if (this.players === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.players.getRows()
    const targetRow = rows.find(row => row.rowIndex === player.tableRow)

    if (targetRow === undefined) {
      throw new Error('Missing target row in the Google Sheets')
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
    }

    return player
  }
}
