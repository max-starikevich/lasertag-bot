import { Telegraf, MiddlewareFn, NarrowedContext } from 'telegraf'
import { CallbackQuery, Update } from 'telegraf/typings/core/types/typegram'

import { GameContext } from '../types'
import { commands } from '../commands'

import { accessMiddleware } from './access'
import { loggingMiddleware } from './logging'
import { analyticsMiddleware } from './analytics'
import { groupChatMiddleware } from './group-chat'

import { help } from '../commands/help'
import { actions } from '../actions'
import { playerMiddleware } from './player'

export type BotMiddleware = MiddlewareFn<NarrowedContext<GameContext, Update.MessageUpdate | Update.CallbackQueryUpdate<CallbackQuery>>>

export const setBotMiddlewares = (bot: Telegraf<GameContext>): void => {
  bot.on('callback_query', loggingMiddleware, analyticsMiddleware, accessMiddleware, groupChatMiddleware, playerMiddleware)
  bot.on('message', loggingMiddleware, analyticsMiddleware, accessMiddleware, groupChatMiddleware, playerMiddleware)

  commands.map((command) => bot.command('/' + command.name, async (ctx) => await command.handler(ctx)))

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) => {
    await ctx.reply(
      `⚠️ ${ctx.lang.UNKNOWN_COMMAND({ helpCommandName: help.name })}`
    )
  })
}

export const setBotActions = (bot: Telegraf<GameContext>): void => {
  actions.map(action => bot.action(action.name, action.handler))
}
