import { BotCommandScope } from 'telegraf/typings/core/types/typegram'

import config from '$/config'

import { GameContext } from './types'
import { commandsInMenu } from '.'

import L from '$/lang/i18n-node'
import { Player } from '$/game/player/types'
import { defaultLocale, extractLocale } from '$/lang/i18n-custom'

export const updateBotWebhook = async (ctx: Pick<GameContext, 'logger' | 'telegram'>): Promise<void> => {
  const { logger, telegram } = ctx

  const { url: savedWebhook } = await telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL === savedWebhook) {
    return
  }

  await telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message', 'callback_query'] })

  logger.info(`✅ The webhook has been updated from "${savedWebhook ?? 'undefined'}" to "${config.WEBHOOK_FULL}"`)
}

export const updateBotCommands = async (ctx: Pick<GameContext, 'logger' | 'telegram' | 'locale'>, scope?: BotCommandScope): Promise<void> => {
  const { logger, telegram, locale } = ctx

  const result = await telegram.setMyCommands(commandsInMenu.map(({ name, description }) => ({
    command: name,
    description: description(L[locale])
  })), { scope })

  logger.info(`✅ Set bot menu for scope: ${JSON.stringify(scope)}, locale "${ctx.locale}", result: "${String(result)}"`)
}

export const unsetCommandsForGroups = async (ctx: Pick<GameContext, 'logger' | 'telegram' >): Promise<void> => {
  const { logger, telegram } = ctx

  await telegram.setMyCommands([], { scope: { type: 'all_group_chats' } })

  logger.info('✅ Unset bot commands for all groups chats')
}

export const updateBotCommandsForPlayers = async (ctx: Pick<GameContext, 'logger' | 'telegram'>, players: Player[]): Promise<void> => {
  const { logger, telegram } = ctx

  for (const player of players) {
    if (player.telegramUserId == null || player.locale === undefined) {
      continue
    }

    const locale = extractLocale(player.locale)

    const scope: BotCommandScope = { type: 'chat', chat_id: player.telegramUserId }

    await updateBotCommands({
      logger,
      telegram,
      locale: locale !== undefined ? locale : defaultLocale
    }, scope)
  }
}
