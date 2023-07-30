import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import config from '$/config'

import { initBot } from '$/bot/bot'
import { parseJsonSafe } from '$/utils'
import { reportException } from '$/errors'

import { GoogleTableGameStorage } from '$/game/storage/google-table/GoogleTableGameStorage'
import { GoogleTableGameStore } from '$/game/storage/google-table/GoogleTableStore'

const storage = new GoogleTableGameStorage({
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

const store = new GoogleTableGameStore({
  email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  privateKey: config.GOOGLE_PRIVATE_KEY,
  docId: config.STORE_DOC_ID,
  sheetsId: config.STORE_SHEETS_ID
})

export const botPromise = initBot({ token: config.BOT_TOKEN, storage, store })

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const bot = await botPromise

    if (bot === null) {
      return {
        statusCode: 500,
        body: 'Cannot initialize bot'
      }
    }

    if (event.body == null) {
      return {
        statusCode: 400,
        body: 'Missing body'
      }
    }

    const payload = parseJsonSafe(event.body)

    if (payload == null) {
      return {
        statusCode: 400,
        body: 'Incorrect payload'
      }
    }

    await bot.handleUpdate(payload)

    return {
      statusCode: 200,
      body: 'OK'
    }
  } catch (e) {
    reportException(e)

    return {
      statusCode: 500,
      body: 'Unexpected server error'
    }
  }
}
