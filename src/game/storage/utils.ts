import { intersection, range } from 'lodash'
import { GoogleSpreadsheetCell, GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

import { NoSheetsError } from '$/errors/NoSheetsError'

import { Player } from '../player/types'
import { EnrollRangesData } from './google-table'

export const saveblePlayerFields: Array<keyof Player> = ['telegramUserId', 'locale']
export const savebleEnrollFields: Array<keyof Player> = ['count', 'rentCount']

export type GoogleSpreadsheetCellMap = { [key in keyof Partial<Player>]: GoogleSpreadsheetCell }

interface GetPlayerCellsParams {
  name: string
  fieldsToSave: Partial<Player>
  players: {
    sheets: GoogleSpreadsheetWorksheet
  }
  enroll: {
    sheets: GoogleSpreadsheetWorksheet
    ranges: EnrollRangesData
  }
}

export const getPlayerCells = async (
  { name, fieldsToSave, players, enroll }: GetPlayerCellsParams
): Promise<GoogleSpreadsheetCellMap> => {
  if (players.sheets === undefined || enroll.sheets === undefined) {
    throw new NoSheetsError()
  }

  const map: GoogleSpreadsheetCellMap = {}

  if (intersection(Object.keys(fieldsToSave), saveblePlayerFields).length > 0) {
    const playerRow = (await players.sheets.getRows()).find(row => row.name === name)

    if (playerRow === undefined) {
      throw new Error('Couldn\'t find the player\'s row in the player sheets.')
    }

    const headers: string[] = players.sheets.headerValues
    const rowIndex = playerRow.rowIndex - 1

    await players.sheets.loadCells([`${players.sheets.a1SheetName}!A1:Z1`, playerRow.a1Range])

    headers.forEach((headerName, columnIndex) => {
      const playerFieldName = headerName as keyof Player

      if (!saveblePlayerFields.includes(playerFieldName)) {
        return
      }

      map[playerFieldName] = players.sheets.getCell(rowIndex, columnIndex)
    })
  }

  if (intersection(Object.keys(fieldsToSave), savebleEnrollFields).length > 0) {
    await enroll.sheets.loadCells([
      enroll.ranges.names.raw,
      enroll.ranges.count.raw,
      enroll.ranges.rent.raw
    ])

    const nameCell = range(enroll.ranges.names.from.num, enroll.ranges.names.to.num)
      .map(n => enroll.sheets.getCellByA1(`${enroll.ranges.names.from.letter}${n}`))
      .find(cell => {
        if (cell.value === name) {
          return true
        }

        return false
      })

    if (nameCell === undefined) {
      throw new Error('Can\'t find player\'s name cell in the enroll table')
    }

    map.name = nameCell
    map.count = enroll.sheets.getCellByA1(`${enroll.ranges.count.from.letter}${nameCell.rowIndex + 1}`)
    map.rentCount = enroll.sheets.getCellByA1(`${enroll.ranges.rent.from.letter}${nameCell.rowIndex + 1}`)
  }

  return map
}
