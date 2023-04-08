import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { decode } from 'html-entities'
import { times, groupBy } from 'lodash'

import { Locales } from '$/lang/i18n-types'

import { extractString } from '$/utils'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { GameStorage } from './types'
import { EditablePlayerFields, Player } from '../player/types'
import { GameLocation } from '../types'
import { getCellsMapByRow } from './utils'

interface GoogleTableConstructorParams {
  spreadsheetId: string
  privateKey: string
  email: string

  playerSheetsId: string
  gameSheetsId: string
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

  constructor ({ spreadsheetId, privateKey, email, playerSheetsId, gameSheetsId }: GoogleTableConstructorParams) {
    this.spreadsheetId = spreadsheetId
    this.privateKey = privateKey
    this.email = email

    this.playerSheetsId = playerSheetsId
    this.gameSheetsId = gameSheetsId
  }

  init = async (): Promise<void> => {
    if (this.playerSheets === undefined || this.gameSheets === undefined) {
      try {
        const document = new GoogleSpreadsheet(this.spreadsheetId)

        await document.useServiceAccountAuth({
          client_email: this.email,
          private_key: this.privateKey
        })

        await document.loadInfo()

        this.playerSheets = document.sheetsById[this.playerSheetsId]
        this.gameSheets = document.sheetsById[this.gameSheetsId]

        if (this.playerSheets === undefined || this.gameSheets === undefined) {
          throw new NoSheetsError()
        }

        this.document = document
      } catch (e) {
        if (e instanceof NoSheetsError) {
          throw e
        }

        throw new NoSheetsError(e)
      }
    }
  }

  getPlayers = async (): Promise<Player[]> => {
    if (this.playerSheets === undefined) {
      await this.init()
    }

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
        isCompanion: false, // will be overriden later
        combinedName: name,
        clanName,
        clanEmoji: clanName?.match(/\p{Emoji}+/gu)?.[0],
        isClanMember: clanName !== undefined,
        isAlone: true, // will be overriden later
        locale
      }

      if (count > 1) {
        const companions = times(count - 1)
          .map(n => n + 1)
          .reduce<Player[]>((companions, num) => {
          const rentCount = player.rentCount - num

          companions.push({
            ...player,
            name: `${name} (${num + 1})`,
            count: 1,
            rentCount: rentCount > 0 ? 1 : 0,
            comment: '',
            level: 0,
            isCompanion: true,
            isAlone: true,
            isClanMember: false,
            clanEmoji: undefined,
            clanName: undefined
          })

          return companions
        }, [])

        players.push(
          {
            ...player,
            rentCount: rentCount > 0 ? 1 : 0,
            combinedName: `${name} ${companions.length > 0 ? `(${companions.length + 1})` : ''
                }`
          },
          ...companions
        )
      } else {
        players.push(player)
      }

      return players
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

  getPlaceAndTime = async (lang: Locales): Promise<GameLocation> => {
    if (this.gameSheets === undefined) {
      await this.init()
    }

    if (this.gameSheets === undefined) {
      throw new NoSheetsError()
    }

    const rows = await this.gameSheets.getRows()

    const gamePlaceRow = rows.find(row => row.lang === lang)

    if (gamePlaceRow === undefined) {
      throw new Error('Missing game place row in the table.')
    }

    return {
      location: gamePlaceRow.location,
      date: gamePlaceRow.date
    }
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
