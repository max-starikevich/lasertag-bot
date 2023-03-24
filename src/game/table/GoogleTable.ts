import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import { escapeHtml } from '$/utils'
import { BaseLogger } from '$/logger/types'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { BaseTable } from './types'

interface GoogleTableConstructorParams {
  spreadsheetId: string
  privateKey: string
  email: string
  rangesToLoad: string[]
}

export class GoogleTable implements BaseTable {
  protected document?: GoogleSpreadsheet
  protected sheets?: GoogleSpreadsheetWorksheet

  protected spreadsheetId: string
  protected privateKey: string
  protected email: string
  protected rangesToLoad: string[]

  constructor ({ spreadsheetId, privateKey, email, rangesToLoad }: GoogleTableConstructorParams) {
    this.spreadsheetId = spreadsheetId
    this.privateKey = privateKey
    this.email = email
    this.rangesToLoad = rangesToLoad
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

    await this.sheets.loadCells(this.rangesToLoad)

    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.info('⬇️  Sheets loaded', {
      timeElapsedMs
    })
  }

  get = (
    a1: string
  ): string | undefined => {
    if (this.sheets == null) {
      throw new NoSheetsError()
    }

    const value = this.sheets.getCellByA1(a1).value

    if (typeof value === 'string' && value.length > 0) {
      return escapeHtml(value)
    }

    if (typeof value === 'number') {
      return escapeHtml(value.toString())
    }

    return undefined
  }

  set = (
    a1: string,
    value: string
  ): void => {
    if (this.sheets == null) {
      throw new NoSheetsError()
    }

    this.sheets.getCellByA1(a1).value = value
  }

  save = async (): Promise<void> => {
    if (this.sheets == null) {
      throw new NoSheetsError()
    }

    return await this.sheets.saveUpdatedCells()
  }
}
