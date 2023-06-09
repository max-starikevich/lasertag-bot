import { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import { GoogleDocumentError } from '$/errors/GoogleDocumentError'
import { GoogleSpreadsheetCellMap } from './types'

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

export const getCellsByRow = async (sheets: GoogleSpreadsheetWorksheet, row: GoogleSpreadsheetRow): Promise<GoogleSpreadsheetCellMap> => {
  const headers: string[] = sheets.headerValues
  const rowIndex = row.rowIndex - 1

  await sheets.loadCells([`${sheets.a1SheetName}!A1:Z1`, row.a1Range])

  const map: GoogleSpreadsheetCellMap = {}

  headers.forEach((headerName, columnIndex) => {
    map[headerName] = sheets.getCell(rowIndex, columnIndex)
  })

  return map
}

export const getCellsByRows = async (sheets: GoogleSpreadsheetWorksheet, rows: GoogleSpreadsheetRow[]): Promise<GoogleSpreadsheetCellMap[]> => {
  const headers: string[] = sheets.headerValues
  const cellMaps: GoogleSpreadsheetCellMap[] = []

  await sheets.loadCells([`${sheets.a1SheetName}!A1:Z1`, ...rows.map(row => row.a1Range)])

  for (const row of rows) {
    const rowIndex = row.rowIndex - 1

    const cellMap: GoogleSpreadsheetCellMap = {}

    headers.forEach((headerName, columnIndex) => {
      cellMap[headerName] = sheets.getCell(rowIndex, columnIndex)
    })

    cellMaps.push(cellMap)
  }

  return cellMaps
}
