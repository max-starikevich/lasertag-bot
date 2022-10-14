import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import config from '$/config'
import { escapeHtml } from '$/utils'

import { ITable } from './types'
import { NoSheetsError } from './errors/NoSheetsError'

const PLAYER_DATA_RANGES = [
  config.NAME_COLUMN,
  config.USERNAME_COLUMN,
  config.COUNT_COLUMN,
  config.RENT_COLUMN,
  config.COMMENT_COLUMN,
  config.LEVEL_COLUMN
]
  .map((column) => `${column}${config.START_FROM_ROW}:${column}${config.MAX_ROW_NUMBER}`)

export class GoogleTable implements ITable {
  constructor (protected spreadsheetId: string, protected apiKey: string) {}

  protected document?: GoogleSpreadsheet
  protected sheets?: GoogleSpreadsheetWorksheet

  refreshData = async (): Promise<void> => {
    if (this.document === undefined || this.sheets === undefined) {
      const document = new GoogleSpreadsheet(this.spreadsheetId)
      document.useApiKey(this.apiKey)

      await document.loadInfo()

      const sheets = document.sheetsByIndex[0] as GoogleSpreadsheetWorksheet | undefined

      if (sheets === undefined) {
        throw new NoSheetsError()
      }

      this.sheets = sheets
      this.document = document
    }

    await this.sheets.loadCells([...PLAYER_DATA_RANGES, ...config.PLACE_AND_TIME_CELLS])
  }

  get = (
    a1: string
  ): string => {
    if (this.sheets === undefined) {
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
}
