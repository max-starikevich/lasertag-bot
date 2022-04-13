
import { Telegraf } from 'telegraf'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { checkEnvironment } from '$/config'
import { BotContext, initBot } from '$/bot'
import { handleWebhookError, handleStartupError } from '$/errors'
import { parseJsonSafe } from '$/utils'

interface BotInstance { bot: Telegraf<BotContext> }

const init = async (): Promise<BotInstance | null> => {
  try {
    await checkEnvironment()

    const bot = await initBot()

    return { bot }
  } catch (e) {
    handleStartupError(e)
    return null
  }
}

export const instancePromise = init()

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const instance = await instancePromise

    if (instance === null) {
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

    const { bot } = instance

    await bot.handleUpdate(payload)

    return {
      statusCode: 200,
      body: 'OK'
    }
  } catch (e) {
    handleWebhookError(e)

    return {
      statusCode: 500,
      body: 'Unexpected server error'
    }
  }
}
