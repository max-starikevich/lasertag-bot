import { Telegraf } from 'telegraf'

import config from '$/config'

import { GameContext } from './types'
import { makeLogger } from '$/logger'
import { commandsInMenu } from '.'

import L from '$/lang/i18n-node'
import { defaultLocale } from '$/lang/i18n-custom'

export const updateBotWebhook = async (bot: Telegraf<GameContext>): Promise<void> => {
  const logger = makeLogger()

  const { url: savedWebhook } = await bot.telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await bot.telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message', 'callback_query'] })
    logger.info(`✅ The webhook has been updated from "${savedWebhook ?? 'undefined'}" to "${config.WEBHOOK_FULL}"`)
  }
}

export const updateBotCommands = async (bot: Telegraf<GameContext>): Promise<void> => {
  const logger = makeLogger()

  await bot.telegram.setMyCommands(commandsInMenu.map(({ name, description }) => ({
    command: name,
    description: description(L[defaultLocale])
  })))

  logger.info('✅ Updated bot commands')
}
