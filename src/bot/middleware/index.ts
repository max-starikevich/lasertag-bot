import { performance } from 'perf_hooks'
import { Telegraf, MiddlewareFn, NarrowedContext } from 'telegraf'
import { Update } from 'typegram'

import config from '$/config'
import { logger } from '$/logger'
import { captureException } from '$/errors'

import { GameContext } from '../types'
import { commands } from '../commands'

export const setBotMiddlewares = (bot: Telegraf<GameContext>): void => {
  bot.on('message', homeChatAccessMiddleware)
  bot.use(errorLoggingMiddleware)

  commands.map((command) =>
    bot.command('/' + command.name, async (ctx) => await command.handler(ctx))
  )

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) => {
    await ctx.reply(
      '⚠️ Не удалось распознать команду. Используйте меню или команду /help'
    )
  })
}

const homeChatAccessMiddleware: MiddlewareFn<NarrowedContext<GameContext, Update.MessageUpdate>> = async (ctx, next) => {
  const startMs = performance.now()

  try {
    await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)
    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.info({
      update: ctx.update,
      status: 'ACCESS_OK',
      timeElapsedMs
    })
  } catch (error) {
    const timeElapsedMs = Math.round(performance.now() - startMs)

    captureException(error)

    logger.warn({
      update: ctx.update,
      status: 'ACCESS_NOT_OK',
      error,
      timeElapsedMs
    })

    await ctx.reply('⚠️ Нет доступа')
    return
  }

  await next()
}

const errorLoggingMiddleware: MiddlewareFn<GameContext> = async (ctx, next) => {
  const startMs = performance.now()

  try {
    await next()
    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.info({
      update: ctx.update,
      status: 'COMMAND_OK',
      timeElapsedMs
    })
  } catch (error) {
    const timeElapsedMs = Math.round(performance.now() - startMs)

    captureException(error)

    logger.error({
      update: ctx.update,
      status: 'COMMAND_NOT_OK',
      error,
      timeElapsedMs
    })

    void ctx.reply('⚠️ Неожиданная ошибка. Повторите запрос позже.')
  }
}
