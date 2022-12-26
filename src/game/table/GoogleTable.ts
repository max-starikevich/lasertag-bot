import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import config from '$/config'

import { escapeHtml } from '$/utils'
import { BaseLogger } from '$/logger/types'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { BaseTable } from './types'

const PLAYER_DATA_RANGES = [
  config.NAME_COLUMN,
  config.RATING_COLUMN,
  config.COUNT_COLUMN,
  config.RENT_COLUMN,
  config.COMMENT_COLUMN
]

  .map((column) => `${column}${config.START_FROM_ROW}:${column}${config.MAX_ROW_NUMBER}`)

const ALL_RANGES_TO_LOAD = [...PLAYER_DATA_RANGES, ...config.PLACE_AND_TIME_CELLS]

interface GoogleTableConstructorParams {
  spreadsheetId: string
  privateKey: string
  email: string
}

export class GoogleTable implements BaseTable {
  protected document?: GoogleSpreadsheet
  protected sheets?: GoogleSpreadsheetWorksheet

  protected spreadsheetId: string
  protected privateKey: string
  protected email: string

  constructor ({ spreadsheetId, privateKey, email }: GoogleTableConstructorParams) {
    this.spreadsheetId = spreadsheetId
    this.privateKey = privateKey
    this.email = email
  }

  refreshData = async ({ logger }: { logger: BaseLogger }): Promise<void> => {
    if (this.sheets === undefined) {
      try {
        const startMs = performance.now()

        const document = new GoogleSpreadsheet(this.spreadsheetId)

        await document.useServiceAccountAuth({
          client_email: this.email,
          private_key: this.privateKey
        })

        await document.loadInfo()

        const timeElapsedMs = Math.round(performance.now() - startMs)

        logger.info('⬇️  Document loaded', {
          timeElapsedMs
        })

        const sheets = document.sheetsByIndex[0]

        this.sheets = sheets
        this.document = document
      } catch (e) {
        throw new NoSheetsError(e)
      }
    }

    const startMs = performance.now()

    await this.sheets.loadCells(ALL_RANGES_TO_LOAD)

    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.info('⬇️  Sheets loaded', {
      timeElapsedMs
    })
  }

  get = (
    a1: string
  ): string => {
    if (this.sheets == null) {
      throw new NoSheetsError()
    }

    const value = this.sheets.getCellByA1(a1).value

    if (typeof value === 'string') {
      return escapeHtml(value)
    }

    if (typeof value === 'number') {
      return escapeHtml(value.toString())
    }

    return ''
  }

  set = async (
    a1: string,
    value: string
  ): Promise<void> => {
    if (this.sheets == null) {
      throw new NoSheetsError()
    }

    const cell = this.sheets.getCellByA1(a1)

    cell.value = value

    return await cell.save()
  }
}
