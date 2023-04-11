/* eslint-disable */
import 'module-alias/register'
import dotenv from 'dotenv'
import axios from 'axios'
import { version } from '../../package.json'

dotenv.config({ path: '.env.production' })

import { checkEnvironment } from '$/config/check'
import { updateBotCommands, updateBotCommandsForPlayers, updateBotWebhook } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { defaultLocale } from '$/lang/i18n-custom'
import { BaseGame } from '$/game/types'
import { initBot } from '$/bot'
/* eslint-enable */

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    await checkEnvironment()
    const bot = await initBot()

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
    const players = await game.getPlayers()

    await updateBotCommandsForPlayers({
      telegram: bot.telegram,
      logger
    }, players)

    const sentryWebhook = process.env.SENTRY_DEPLOY_WEBHOOK

    if (sentryWebhook === undefined) {
      throw new Error("Sentry Webhook isn't specified")
    }

    await axios.post(sentryWebhook, {
      version
    })

    logger.info(`✅ Created v${version} release in Sentry`)
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
