import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import { config } from '$/config'
import { bot, handler } from '$/lambda'
import { unsetCommandsForGroups, updateBotCommands, updateBotCommandsForPlayers, updateBotWebhook } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { GameContext } from '$/bot/types'

const dev = async (): Promise<void> => {
  const logger = makeLogger()
  const { factories: { storageFactory } } = bot.context as GameContext

  try {
    await updateBotWebhook({
      telegram: bot.telegram,
      logger
    })

    await unsetCommandsForGroups({
      telegram: bot.telegram,
      logger
    })

    await updateBotCommands({
      telegram: bot.telegram,
      logger,
      locale: config.DEFAULT_LOCALE
    })

    const storage = await storageFactory()

    if (storage === undefined) {
      throw new Error('Storage is unavailable')
    }

    const players = await storage.getPlayers()

    await updateBotCommandsForPlayers({
      telegram: bot.telegram,
      logger
    }, players)

    logger.info('✅ Updated bot commands for registered users')

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
        ctx.status = 200
        logger.error(e)
      }
    })

    app.use(router.routes())

    app.listen(config.PORT, () => {
      logger.info(
        `🚀 Dev server is ready: ${config.WEBHOOK_BASE}/*`
      )
    })
  } catch (e) {
    logger.error(e)
  }
}

void dev()
