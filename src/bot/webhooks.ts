import { Telegraf } from 'telegraf'

import config from '$/config'

import { GameContext } from './types'

export const updateWebhook = async (bot: Telegraf<GameContext>): Promise<void> => {
  const { url: savedWebhook } = await bot.telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await bot.telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message'] })
  }
}
