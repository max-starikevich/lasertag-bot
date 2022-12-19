import { Telegraf, MiddlewareFn, NarrowedContext } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'

import { GameContext } from '../types'
import { commands } from '../commands'

import { accessMiddleware } from './access'
import { errorMiddleware } from './error'
import { loggingMiddleware } from './logging'
import { analyticsMiddleware } from './analytics'

export type BotMiddleware = MiddlewareFn<NarrowedContext<GameContext, Update.MessageUpdate>>

export const setBotMiddlewares = (bot: Telegraf<GameContext>): void => {
  bot.on('message', loggingMiddleware, analyticsMiddleware, accessMiddleware)

  commands.map((command) => bot.command('/' + command.name, async (ctx) => await command.handler(ctx)))

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) => {
    await ctx.reply(
      '⚠️ Не удалось распознать команду. Используйте меню или команду /help'
    )
  })

  bot.catch(errorMiddleware)
}
