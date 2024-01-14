import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Update } from 'telegraf/typings/core/types/typegram'

import { initBot } from '$/bot/bot'
import { parseJsonSafe } from '$/utils'
import { reportException } from '$/errors'

import { getStorage } from '$/features/players/storage'
import { getKeyValueStore } from '$/features/key-value'

import { getNoClansBalancer } from '$/features/players/balancers/no-clans'
import { getClansBalancer } from '$/features/players/balancers/clans'
import { getChatGptBalancer } from '$/features/players/balancers/chatgpt'

export const bot = initBot({
  getStorage,
  getKeyValueStore,
  getNoClansBalancer,
  getClansBalancer,
  getChatGptBalancer
})

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
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

    const update = parseJsonSafe<Update>(event.body)

    if (update == null) {
      return {
        statusCode: 400,
        body: 'Incorrect payload'
      }
    }

    await bot.handleUpdate(update)

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
