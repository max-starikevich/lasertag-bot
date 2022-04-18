import dotenv from 'dotenv'
dotenv.config({ path: '.env.production' })

import 'module-alias/register'

import { Telegraf } from 'telegraf'

import config, { checkEnvironment } from '$/config'
import { logger } from '$/logger'
import { BotContext, updateWebhook } from '$/bot'

async function run (): Promise<void> {
  try {
    await checkEnvironment()
    logger.info(`✅ Environment is OK. APP_ENV: ${config.APP_ENV}`)

    const bot = new Telegraf<BotContext>(config.BOT_TOKEN)
    await updateWebhook(bot)

    logger.info(`✅ Webhook has been updated: ${config.WEBHOOK_BASE}/*`)
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
