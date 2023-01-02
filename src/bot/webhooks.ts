import { Telegraf } from 'telegraf'

import config from '$/config'

import { GameContext } from './types'
import { makeLogger } from '$/logger'
import { commandsInMenu } from '.'

export const updateBotWebhook = async (bot: Telegraf<GameContext>): Promise<void> => {
  const logger = makeLogger()

  const { url: savedWebhook } = await bot.telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await bot.telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message'] })
    logger.info(`✅ The webhook has been updated from "${savedWebhook ?? 'undefined'}" to "${config.WEBHOOK_FULL}"`)
  }
}

export const updateBotCommands = async (bot: Telegraf<GameContext>): Promise<void> => {
  const logger = makeLogger()

  await bot.telegram.setMyCommands(commandsInMenu.map(({ name, description }) => ({
    command: name,
    description
  })))

  logger.info('✅ Updated bot commands')
}
