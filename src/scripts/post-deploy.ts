/* eslint-disable */
import 'module-alias/register'
import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import axios from 'axios'
import { version } from '../../package.json'

dotenv.config({ path: '.env.production' })

import config from '$/config'
import { checkEnvironment } from '$/config/check'
import { updateBotCommands, updateBotWebhook } from '$/bot/webhooks'
import { GameContext } from '$/bot/types'
import { makeLogger } from '$/logger'
import { defaultLocale } from '$/lang/i18n-custom'
/* eslint-enable */

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    await checkEnvironment()

    const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

    await updateBotWebhook({
      telegram: bot.telegram,
      logger
    })

    await updateBotCommands({
      telegram: bot.telegram,
      logger,
      locale: defaultLocale
    })

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
