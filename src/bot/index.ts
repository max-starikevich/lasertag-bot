import { Telegraf } from 'telegraf'

import config from '$/config'
import { setBotCommands } from '$/bot/commands'
import { BotContext } from '$/bot/context'

export const initBot = async (): Promise<Telegraf<BotContext>> => {
  const bot = new Telegraf<BotContext>(config.BOT_TOKEN)
  await setBotCommands(bot)
  return bot
}

export const updateWebhook = async (bot: Telegraf<BotContext>): Promise<void> => {
  const { url: savedWebhook } = await bot.telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await bot.telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message'] })
  }
}
