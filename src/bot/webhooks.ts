import { BotCommandScope } from 'telegraf/typings/core/types/typegram'

import config from '$/config'

import { GameContext } from './types'
import { commandsInMenu } from '.'

import L from '$/lang/i18n-node'
import { Player } from '$/game/player/types'
import { getLocaleByName } from '$/lang/i18n-custom'

export const updateBotWebhook = async (ctx: Pick<GameContext, 'logger' | 'telegram'>): Promise<void> => {
  const { logger, telegram } = ctx

  const { url: savedWebhook } = await telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message', 'callback_query'] })
    logger.info(`✅ The webhook has been updated from "${savedWebhook ?? 'undefined'}" to "${config.WEBHOOK_FULL}"`)
  }
}

export const updateBotCommands = async (ctx: Pick<GameContext, 'logger' | 'telegram' | 'locale'>, scope?: BotCommandScope): Promise<void> => {
  const { logger, telegram } = ctx

  await telegram.setMyCommands(commandsInMenu.map(({ name, description }) => ({
    command: name,
    description: description(L[ctx.locale])
  })), { scope })

  logger.info(`✅ Updated bot menu: ${commandsInMenu.length} commands in scope: ${JSON.stringify(scope)}, with locale: ${ctx.locale}`)
}

export const updateBotCommandsForPlayers = async (ctx: Pick<GameContext, 'logger' | 'telegram'>, players: Player[]): Promise<void> => {
  const { logger, telegram } = ctx

  for (const player of players) {
    if (player.locale === undefined || player.telegramUserId === undefined) {
      continue
    }

    const locale = getLocaleByName(player.locale)

    if (locale === undefined) {
      continue
    }

    const scope: BotCommandScope = { type: 'chat', chat_id: player.telegramUserId }

    await updateBotCommands({
      logger, telegram, locale
    }, scope)
  }
}
