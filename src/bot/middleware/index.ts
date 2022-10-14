import { performance } from 'perf_hooks'
import { Telegraf } from 'telegraf'

import config from '$/config'
import { logger } from '$/logger'

import { GameContext } from '../types'
import { commands } from '../commands'

export const setBotMiddlewares = (bot: Telegraf<GameContext>): void => {
  setHomeChatAccess(bot)
  setLogging(bot)
  setCommands(bot)
  setUnknownCommands(bot)
}

const setHomeChatAccess = (bot: Telegraf<GameContext>): void => {
  bot.on('message', async (ctx, next) => {
    const startMs = performance.now()

    try {
      await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)

      const endMs = performance.now()
      const timeElapsedMs = Math.round(endMs - startMs)

      logger.info({
        update: ctx.update,
        status: 'ACCESS_OK',
        timeElapsedMs
      })
    } catch (error) {
      const endMs = performance.now()
      const timeElapsedMs = Math.round(endMs - startMs)

      logger.error({
        update: ctx.update,
        status: 'ACCESS_NOT_OK',
        error,
        timeElapsedMs
      })

      await ctx.reply('⚠️ Нет доступа')
      return
    }

    await next()
  })
}

const setLogging = (bot: Telegraf<GameContext>): void => {
  bot.use(async (ctx, next) => {
    const startMs = performance.now()

    try {
      await next()

      const endMs = performance.now()
      const timeElapsedMs = Math.round(endMs - startMs)

      logger.info({
        update: ctx.update,
        status: 'COMMAND_OK',
        timeElapsedMs
      })
    } catch (error) {
      const endMs = performance.now()
      const timeElapsedMs = Math.round(endMs - startMs)

      logger.error({
        update: ctx.update,
        status: 'COMMAND_NOT_OK',
        error,
        timeElapsedMs
      })
    }
  })
}

const setCommands = (bot: Telegraf<GameContext>): void => {
  commands.map((command) =>
    bot.command('/' + command.name, async (ctx) => {
      try {
        await command.handler(ctx)
      } catch (e) {
        logger.error(e)
        void ctx.reply('⚠️ Неожиданная ошибка. Повторите запрос позже.')
      }
    })
  )
}

const setUnknownCommands = (bot: Telegraf<GameContext>): void => {
  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) => {
    await ctx.reply(
      '⚠️ Не удалось распознать команду. Используйте меню или команду /help'
    )
  })
}
