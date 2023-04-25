import { GoogleSpreadsheetCell } from 'google-spreadsheet'

import config from '$/config'
import { NoSheetsError } from '$/errors/NoSheetsError'

import { Player, UpdatedPlayer } from '../player/types'
import { intersection, range } from 'lodash'
import { extractRange } from '../../utils'
import { EnrollSheets, PlayersSheets, enrollFields, playerFields } from './google-table'

export type GoogleSpreadsheetCellMap = { [key in keyof Partial<Player>]: GoogleSpreadsheetCell }

export const getPlayerCells = async (
  player: UpdatedPlayer,
  players: PlayersSheets,
  enroll: EnrollSheets
): Promise<GoogleSpreadsheetCellMap> => {
  if (players.sheets === undefined || enroll.sheets === undefined) {
    throw new NoSheetsError()
  }

  const map: GoogleSpreadsheetCellMap = {}

  if (intersection(Object.keys(player), playerFields).length > 0) {
    const playerRow = (await players.sheets.getRows()).find(row => row.rowIndex === player.tableRow)

    if (playerRow === undefined) {
      throw new Error('Couldn\'t find the player\'s row in the player sheets.')
    }

    const headers: string[] = players.sheets.headerValues
    const rowIndex = playerRow.rowIndex - 1

    await players.sheets.loadCells([`${players.sheets.a1SheetName}!A1:Z1`, playerRow.a1Range])

    headers.forEach((headerName, columnIndex) => {
      const playerFieldName = headerName as keyof Player

      if (!playerFields.includes(playerFieldName)) {
        return
      }

      map[playerFieldName] = players.sheets?.getCell(rowIndex, columnIndex)
    })
  }

  if (intersection(Object.keys(player), enrollFields).length > 0) {
    await enroll.sheets.loadCells([
      config.ENROLL_NAMES_RANGE,
      config.ENROLL_COUNT_RANGE,
      config.ENROLL_RENT_RANGE
    ])

    const namesRange = extractRange(config.ENROLL_NAMES_RANGE)
    const countRange = extractRange(config.ENROLL_COUNT_RANGE)
    const rentRange = extractRange(config.ENROLL_RENT_RANGE)

    if (namesRange === null || countRange === null || rentRange === null) {
      throw new Error('Invalid names range in the enroll sheets.')
    }

    const nameCell = range(namesRange.from.num, namesRange.to.num)
      .map(n => enroll.sheets?.getCellByA1(`${namesRange.from.letter}${n}`))
      .find(cell => {
        if (cell?.value === player.name) {
          return true
        }

        return false
      })

    if (nameCell === undefined) {
      throw new Error('Can\'t find player\'s name cell in the enroll table')
    }

    map.name = nameCell
    map.count = enroll.sheets.getCellByA1(`${countRange.from.letter}${nameCell.rowIndex + 1}`)
    map.rentCount = enroll.sheets.getCellByA1(`${rentRange.from.letter}${nameCell.rowIndex + 1}`)
  }

  return map
}
