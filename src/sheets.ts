import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet
} from 'google-spreadsheet'

import config from '$/config'
import { escapeHtml } from '$/utils'
import { Player } from '$/player'
import { logger } from '$/logger'

const {
  NAME_COLUMN,
  USERNAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN,
  START_FROM_ROW,
  MAX_ROW_NUMBER,
  DEFAULT_PLAYER_LEVEL,
  PLACE_AND_TIME_CELLS
} = config

const PLAYER_DATA_RANGES = [
  NAME_COLUMN,
  USERNAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN
]
  .map((column) => `${column}${START_FROM_ROW}:${column}${MAX_ROW_NUMBER}`)

export const loadAppCells = async (document: GoogleSpreadsheet): Promise<void> => {
  const sheet = document.sheetsByIndex[0]
  return await sheet.loadCells([...PLAYER_DATA_RANGES, ...PLACE_AND_TIME_CELLS])
}

export const getSpreadsheetDocument = (): GoogleSpreadsheet => {
  const document = new GoogleSpreadsheet(config.GOOGLE_SPREADSHEET_ID)
  document.useApiKey(config.GOOGLE_API_KEY)
  return document
}

const getSheetsValue = (
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

export const getActivePlayers = async (document: GoogleSpreadsheet): Promise<Player[]> => {
  const sheet = document.sheetsByIndex[0]
  const activePlayers: Player[] = []

  for (let row = START_FROM_ROW; row < MAX_ROW_NUMBER; row++) {
    const count = getSheetsValue(sheet, COUNT_COLUMN + row.toString())
    const name = getSheetsValue(sheet, NAME_COLUMN + row.toString())
    const player: Player = {
      name,
      count: +count.replace('?', '') ?? 0,
      rentCount: +getSheetsValue(sheet, RENT_COLUMN + row.toString()) ?? 0,
      comment: getSheetsValue(sheet, COMMENT_COLUMN + row.toString()),
      level: +getSheetsValue(sheet, LEVEL_COLUMN + row.toString()) ?? DEFAULT_PLAYER_LEVEL,
      isQuestionable: count.includes('?'),
      isCompanion: false,
      combinedName: name
    }

    if (player.count === 1) {
      activePlayers.push(player)
    }

    if (player.count > 1) {
      const combinedPlayers: Player[] = []

      for (
        let i = 1, rentCount = player.rentCount;
        i <= player.count;
        i++, rentCount--
      ) {
        const isCompanion = i > 1

        combinedPlayers.push({
          ...player,
          name: player.name + (isCompanion ? ` (${i})` : ''),
          count: 1,
          rentCount: rentCount > 0 ? 1 : 0,
          comment: isCompanion ? '' : player.comment,
          level: isCompanion ? DEFAULT_PLAYER_LEVEL : player.level,
          isCompanion
        })
      }

      const [main, ...companions] = combinedPlayers

      activePlayers.push(
        {
          ...main,
          combinedName: `${main.name} ${
            companions.length > 0 ? `(${companions.length + 1})` : ''
          }`
        },
        ...companions
      )
    }
  }

  void sheet.loadCells(PLAYER_DATA_RANGES).catch(logger.error)

  return activePlayers
}

export const getPlaceAndTime = async (document: GoogleSpreadsheet): Promise<string> => {
  const sheet = document.sheetsByIndex[0]

  const placeAndTime = PLACE_AND_TIME_CELLS.map((cell) => getSheetsValue(sheet, cell)).join(
    ', '
  )

  void sheet.loadCells(PLACE_AND_TIME_CELLS).catch(logger.error)

  return placeAndTime
}
