import { Telegraf, MiddlewareFn } from 'telegraf'
import { Message, Update } from 'telegraf/typings/core/types/typegram'

import { GameContext } from '../types'
import { commands } from '../commands'
import { help } from '../commands/help'
import { actions } from '../actions'

import { accessMiddleware } from './access'
import { loggingMiddleware } from './logging'
import { analyticsMiddleware } from './analytics'
import { playerMiddleware } from './player'

export type BotMiddleware = MiddlewareFn<GameContext<Update.MessageUpdate<Message.TextMessage> | Update.CallbackQueryUpdate>>

export const setBotMiddlewares = (bot: Telegraf<GameContext>): void => {
  bot.on('text', loggingMiddleware, analyticsMiddleware, accessMiddleware, playerMiddleware)
  bot.on('callback_query', loggingMiddleware, analyticsMiddleware, accessMiddleware, playerMiddleware)

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
