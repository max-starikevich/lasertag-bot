import 'module-alias/register'
import 'dotenv/config'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import { instancePromise, handler } from '$/handler'
import config from '$/config'
import { logger } from '$/logger'
import { updateWebhook } from '$/bot'

const dev = async (): Promise<void> => {
  try {
    const instance = await instancePromise

    if (instance == null) {
      throw new Error('The instance is unavailable')
    }

    const { bot } = instance

    await updateWebhook(bot)

    const app = new Koa()
    const router = new Router()

    app.use(bodyParser())

    router.post(config.WEBHOOK_PATH, async (ctx) => {
      try {
        const event = {
          body: ctx.request.rawBody
        } as any

        const { statusCode, body } = await handler(event)

        ctx.status = statusCode
        ctx.body = body
      } catch (e) {
        logger.error(e)
      }
    })

    app.use(router.routes())

    app.listen(config.PORT, () => {
      console.info(
        `🚀 Development server is ready at https://${config.WEBHOOK_BASE}`
      )
    })
  } catch (e) {
    logger.error(e)
  }
}

void dev()
