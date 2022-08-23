import { GoogleSpreadsheet } from 'google-spreadsheet'

import config from '$/config'
import { Player } from '$/services/Player'
import { getSheetsValue } from '$/services/Table'

export const {
  NAME_COLUMN,
  USERNAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN,
  START_FROM_ROW,
  MAX_ROW_NUMBER,
  PLACE_AND_TIME_CELLS,
  DEFAULT_PLAYER_LEVEL
} = config

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

  return activePlayers
}

export const getPlaceAndTime = async (document: GoogleSpreadsheet): Promise<string> => {
  const sheet = document.sheetsByIndex[0]

  const placeAndTime = PLACE_AND_TIME_CELLS.map((cell) => getSheetsValue(sheet, cell)).join(
    ', '
  )

  return placeAndTime
}
