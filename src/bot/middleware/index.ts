import { Telegraf, MiddlewareFn } from 'telegraf'

import { GameContext } from '../types'
import { commands } from '../commands'

import { accessMiddleware } from './access'
import { loggingMiddleware } from './logging'
import { analyticsMiddleware } from './analytics'
import { groupChatMiddleware } from './group-chat'

import { help } from '../commands/help'
import { actions } from '../actions'
import { playerMiddleware } from './player'

export type BotMiddleware = MiddlewareFn<GameContext>

export const setBotMiddlewares = (bot: Telegraf<GameContext>): void => {
  bot.on('text', loggingMiddleware, analyticsMiddleware, accessMiddleware, groupChatMiddleware, playerMiddleware)
  bot.on('callback_query', loggingMiddleware, analyticsMiddleware, accessMiddleware, groupChatMiddleware, playerMiddleware)

  commands.map((command) => bot.command(command.name, async (ctx) => await command.handler(ctx)))

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) => {
    await ctx.reply(
      `⚠️ ${ctx.lang.UNKNOWN_COMMAND({ helpCommandName: help.name })}`
    )
  })
}

export const setBotActions = (bot: Telegraf<GameContext>): void => {
  actions.map(action =>
    Object.entries(action.mapping).map(([name, handler]) =>
      bot.action(RegExp(name), handler)
    )
  )
}
