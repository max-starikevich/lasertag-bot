import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { keyBy } from 'lodash'

import { parseJsonSafe } from '$/utils'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { GameStore, StoreData } from '../types'

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

  async get <T>(keys: string[]): Promise<Array<StoreData<T>>> {
    const sheets = await this.getSheets()
    const rows = await sheets.getRows()

    const map = keyBy<GoogleSpreadsheetRow>(rows, row => row.key)

    return keys.map(key => {
      const row = map[key]

      if (row === undefined) {
        return {
          key, value: null
        }
      }

      return {
        key,
        value: parseJsonSafe<T>(row.value)
      }
    })
  }

  async set <T>(data: Array<StoreData<T>>): Promise<void> {
    const sheets = await this.getSheets()

    for (const { key, value } of data) {
      if (value === null) {
        continue
      }

      await sheets.addRow({ key, value: JSON.stringify(value) })
    }
  }

  async delete (keys: string[]): Promise<void> {
    const sheets = await this.getSheets()
    const rows = await sheets.getRows()

    const map = keyBy<GoogleSpreadsheetRow>(rows, row => row.key)

    for (const key of keys) {
      if (map[key] == null) {
        continue
      }

      const row = map[key]

      await row.delete()
    }
  }
}
