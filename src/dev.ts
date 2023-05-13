import 'module-alias/register'
import 'dotenv/config'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import config from '$/config'
import { botPromise, handler } from '$/lambda'
import { updateBotCommands, updateBotCommandsForPlayers, updateBotWebhook } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { defaultLocale } from '$/lang/i18n-custom'
import { BaseGame } from '$/game/types'

const dev = async (): Promise<void> => {
  const logger = makeLogger()

  try {
    const bot = await botPromise

    if (bot == null) {
      throw new Error('The instance is unavailable')
    }

    await updateBotWebhook({
      telegram: bot.telegram,
      logger
    })

    await updateBotCommands({
      telegram: bot.telegram,
      logger,
      locale: defaultLocale
    })

    const game = bot.context.game as BaseGame

    const players = await game.getPlayers({
      logger
    })

    await updateBotCommandsForPlayers({
      telegram: bot.telegram,
      logger
    }, players)

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
