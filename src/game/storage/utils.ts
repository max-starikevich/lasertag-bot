import { GoogleSpreadsheetCell, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

interface GoogleSpreadsheetCellMap { [columnName: string]: GoogleSpreadsheetCell }

export const getCellsMapByRow = async (row: GoogleSpreadsheetRow): Promise<GoogleSpreadsheetCellMap> => {
  const headers: string[] = row._sheet.headerValues
  const sheets: GoogleSpreadsheetWorksheet = row._sheet
  const rowIndex = row.rowIndex - 1

  await sheets.loadCells([`${sheets.a1SheetName}!A1:Z1`, row.a1Range])

  return headers.reduce<GoogleSpreadsheetCellMap>((mapping, headerName, columnIndex) => {
    if (headerName.length === 0) {
      return mapping
    }

    mapping[headerName] = sheets.getCell(rowIndex, columnIndex)
    return mapping
  }, {})
}
