import { BotCommandScope } from 'telegraf/typings/core/types/typegram'

import config from '$/config'

import { GameContext } from './types'
import { commandsInMenu } from '.'

import L from '$/lang/i18n-node'

export const updateBotWebhook = async (ctx: Pick<GameContext, 'logger' | 'telegram'>): Promise<void> => {
  const { logger, telegram } = ctx

  const { url: savedWebhook } = await telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message', 'callback_query'] })
    logger.info(`✅ The webhook has been updated from "${savedWebhook ?? 'undefined'}" to "${config.WEBHOOK_FULL}"`)
  }
}

export const updateBotCommands = async (ctx: Pick<GameContext, 'telegram' | 'locale'>, scope?: BotCommandScope): Promise<void> => {
  const { telegram } = ctx

  await telegram.setMyCommands(commandsInMenu.map(({ name, description }) => ({
    command: name,
    description: description(L[ctx.locale])
  })), { scope })
}
