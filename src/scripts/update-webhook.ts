
import { Telegraf } from 'telegraf'
import config from '$/config'
import { logger } from '$/logger'
import { BotContext, updateWebhook } from '$/bot'

async function run (): Promise<void> {
  try {
    const bot = new Telegraf<BotContext>(config.BOT_TOKEN)
    await updateWebhook(bot)
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
