/* eslint-disable */
import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.production' })

import axios from 'axios'
import { version } from '../../package.json'

import { updateBotCommands, updateBotCommandsForPlayers, updateBotWebhook } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { defaultLocale } from '$/lang/i18n-custom'
import { botPromise } from '$/lambda'
import { GameStorage } from '$/game/storage/types'
/* eslint-enable */

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    const bot = await botPromise

    await updateBotWebhook({
      telegram: bot.telegram,
      logger
    })

    await updateBotCommands({
      telegram: bot.telegram,
      logger,
      locale: defaultLocale
    })

    const storage = bot.context.storage as GameStorage
    const players = await storage.getPlayers()

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
