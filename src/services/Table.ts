import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet
} from 'google-spreadsheet'

import config from '$/config'
import { escapeHtml } from '$/utils'

export const {
  NAME_COLUMN,
  USERNAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN,
  START_FROM_ROW,
  MAX_ROW_NUMBER,
  PLACE_AND_TIME_CELLS
} = config

export const PLAYER_DATA_RANGES = [
  NAME_COLUMN,
  USERNAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN
]
  .map((column) => `${column}${START_FROM_ROW}:${column}${MAX_ROW_NUMBER}`)

const loadDocument = async (document: GoogleSpreadsheet): Promise<void> => {
  await document.loadInfo()
  await loadSheet(document.sheetsByIndex[0])
}

const initDocument = (): GoogleSpreadsheet => {
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID)
  document.useApiKey(config.GOOGLE_API_KEY)

  return document
}

export const loadSheet = async (sheet: GoogleSpreadsheetWorksheet): Promise<void> =>
  await sheet.loadCells([...PLAYER_DATA_RANGES, ...PLACE_AND_TIME_CELLS])

export const initAndLoadDocument = async (): Promise<GoogleSpreadsheet> => {
  const document = initDocument()
  await loadDocument(document)

  return document
}

export const getSheetsValue = (
  sheet: GoogleSpreadsheetWorksheet,
  a1: string
): string => {
  const value = sheet.getCellByA1(a1).value

  if (typeof value === 'string') {
    return escapeHtml(value)
  }

  if (typeof value === 'number') {
    return escapeHtml(value.toString())
  }

  return ''
}
