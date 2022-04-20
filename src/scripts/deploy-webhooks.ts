import dotenv from 'dotenv'
dotenv.config({ path: '.env.production' })

import 'module-alias/register'

import { Telegraf } from 'telegraf'
import axios from 'axios'

import { version } from '../../package.json'
import config, { checkEnvironment } from '$/config'
import { logger } from '$/logger'
import { BotContext, updateWebhook } from '$/bot'

async function run (): Promise<void> {
  try {
    await checkEnvironment()

    const bot = new Telegraf<BotContext>(config.BOT_TOKEN)
    
    await updateWebhook(bot)
    
    logger.info(`✅ Telegram webhook has been updated: ${config.WEBHOOK_BASE}/*`)

    const sentryWebhook = process.env.SENTRY_DEPLOY_WEBHOOK

    if (sentryWebhook && new URL(sentryWebhook)) {
      await axios.post(sentryWebhook, {
        version
      })

      logger.info(`✅ Created v${version} release in Sentry`)
    }
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
