import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import { GoogleDocumentError } from '$/errors/GoogleDocumentError'

import { ArbitraryPlayer } from '../types'
import { AiSkillsStorage } from './types'

interface GoogleTableSkillsStorageParams {
  email: string
  privateKey: string
  docId: string
  sheetsId: string
}

export class GoogleTableSkillsStorage implements AiSkillsStorage {
  protected doc?: GoogleSpreadsheet

  protected email: string
  protected privateKey: string
  protected docId: string
  protected sheetsId: string

  constructor (params: GoogleTableSkillsStorageParams) {
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
      throw new GoogleDocumentError(`Missing sheets with id ${this.sheetsId} in document ${this.docId}`)
    }

    return sheets
  }

  async find (_keys: string[]): Promise<ArbitraryPlayer[]> {
    // const sheets = await this.getSheets()
    // const rows = await sheets.getRows()

    return []
  }

  async findAll (): Promise<ArbitraryPlayer[]> {
    return []
  }
}
