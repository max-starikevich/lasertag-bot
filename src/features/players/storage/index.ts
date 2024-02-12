import { config } from '$/config'
import { FeatureUnavailableError } from '$/errors/FeatureUnavailableError'

import { GoogleTableGameStorage } from './google-sheets/GoogleSheetsStorage'
import { IGameStorage } from './types'

let storage: IGameStorage

export const storageFactory = async (): Promise<IGameStorage> => {
  if (
    config.GOOGLE_SERVICE_ACCOUNT_EMAIL === undefined ||
    config.GOOGLE_PRIVATE_KEY === undefined ||
    config.PLAYERS_DOC_ID === undefined ||
    config.PLAYERS_SHEETS_ID === undefined ||
    config.GAME_DOC_ID === undefined ||
    config.GAME_SHEETS_ID === undefined ||
    config.LINKS_DOC_ID === undefined ||
    config.LINKS_SHEETS_ID === undefined ||
    config.STATS_DOC_ID === undefined ||
    config.STATS_SHEETS_ID === undefined ||
    config.STATS_TIMEZONE === undefined ||
    config.ENROLL_DOC_ID === undefined ||
    config.ENROLL_SHEETS_ID === undefined ||
    config.ENROLL_NAMES_RANGE === undefined ||
    config.ENROLL_COUNT_RANGE === undefined ||
    config.ENROLL_RENT_RANGE === undefined ||
    config.ENROLL_COMMENT_RANGE === undefined
  ) {
    throw new FeatureUnavailableError()
  }

  if (storage === undefined) {
    storage = new GoogleTableGameStorage({
      email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: config.GOOGLE_PRIVATE_KEY,
      players: {
        docId: config.PLAYERS_DOC_ID,
        sheetsId: config.PLAYERS_SHEETS_ID
      },
      game: {
        docId: config.GAME_DOC_ID,
        sheetsId: config.GAME_SHEETS_ID
      },
      links: {
        docId: config.LINKS_DOC_ID,
        sheetsId: config.LINKS_SHEETS_ID
      },
      stats: {
        docId: config.STATS_DOC_ID,
        sheetsId: config.STATS_SHEETS_ID,
        timezone: config.STATS_TIMEZONE
      },
      enroll: {
        docId: config.ENROLL_DOC_ID,
        sheetsId: config.ENROLL_SHEETS_ID,
        ranges: {
          names: config.ENROLL_NAMES_RANGE,
          count: config.ENROLL_COUNT_RANGE,
          rent: config.ENROLL_RENT_RANGE,
          comment: config.ENROLL_COMMENT_RANGE
        }
      }
    })
  }

  return storage
}
