import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import { GoogleDocumentError } from '$/errors/GoogleDocumentError'
import { Skills, ISkillsRepository } from './types'

interface GoogleTableSkillsRepositoryParams {
  email: string
  privateKey: string
  docId: string
  sheetsId: string
}

export class GoogleTableSkillsRepository implements ISkillsRepository {
  protected doc?: GoogleSpreadsheet

  protected email: string
  protected privateKey: string
  protected docId: string
  protected sheetsId: string

  constructor (params: GoogleTableSkillsRepositoryParams) {
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

  async find (ids: string[]): Promise<Skills[]> {
    const sheets = await this.getSheets()
    const rows = await sheets.getRows()

    const columnNames = sheets.headerValues

    const players = rows.filter(row => ids.includes(row.Name)).map(row => {
      const player: Skills = {
        Name: row.Name
      }

      columnNames.forEach((columnName) => {
        const columnValue = row[columnName]

        if (columnValue == null) {
          return
        }

        player[columnName] = columnValue
      })

      return player
    }, {})

    return players
  }
}
