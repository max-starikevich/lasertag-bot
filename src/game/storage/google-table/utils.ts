import { GoogleSpreadsheetRow } from 'google-spreadsheet'

import { GoogleDocumentError } from '$/errors/GoogleDocumentError'

const cellErrors = ['#REF!', '#ERROR', '#NAME?', '#VALUE!']

export const assertRows = (rows: GoogleSpreadsheetRow[]): void => {
  const errorRows = rows.filter((row) =>
    Object.keys(row)
      .map(key => row[key])
      .filter(v => {
        if (typeof v !== 'string') { return false }
        if (cellErrors.includes(v)) { return true }
        return false
      }).length > 0
  )

  if (errorRows.length > 0) {
    throw new GoogleDocumentError()
  }
}
