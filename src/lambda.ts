import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { initBot } from '$/bot'
import { handleWebhookError } from '$/errors'
import { parseJsonSafe } from '$/utils'

export const botPromise = initBot()

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
    handleWebhookError(e as Error)

    return {
      statusCode: 500,
      body: 'Unexpected server error'
    }
  }
}
