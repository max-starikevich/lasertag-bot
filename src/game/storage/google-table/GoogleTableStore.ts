import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import { parseJsonSafe } from '$/utils'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { GameStore } from '../types'

interface GoogleTableGameStorageParams {
  email: string
  privateKey: string
  docId: string
  sheetsId: string
}

export class GoogleTableGameStore implements GameStore {
  protected doc?: GoogleSpreadsheet

  protected email: string
  protected privateKey: string
  protected docId: string
  protected sheetsId: string

  constructor (params: GoogleTableGameStorageParams) {
    this.email = params.email
    this.privateKey = params.privateKey
    this.docId = params.docId
    this.sheetsId = params.sheetsId
  }

  protected async getSheets (): Promise<GoogleSpreadsheetWorksheet> {
    if (this.doc === undefined) {
      const document = new GoogleSpreadsheet(this.docId)

      await document.useServiceAccountAuth({
        client_email: this.email,
        private_key: this.privateKey
      })

      await document.loadInfo()

      this.doc = document
    }

    const document = this.doc
    const sheets = document.sheetsById[this.sheetsId]

    if (sheets === undefined) {
      throw new NoSheetsError()
    }

    return sheets
  }

  async get <T>(key: string): Promise<T | null> {
    const sheets = await this.getSheets()
    const rows = await sheets.getRows()

    const row = rows.find(row => row.key === key)

    if (row === undefined) {
      return null
    }

    return parseJsonSafe<T>(row.value)
  }

  async set <T>(key: string, value: T): Promise<void> {
    const sheets = await this.getSheets()
    await sheets.addRow({ key, value: JSON.stringify(value) })
  }

  async delete (key: string): Promise<void> {
    const sheets = await this.getSheets()
    const rows = await sheets.getRows()

    const row = rows.find(row => row.key === key)

    if (row === undefined) {
      return
    }

    await row.delete()
  }
}
