import { Telegraf } from 'telegraf'

import config from '$/config'
import { logger } from '$/logger'

import { Game } from '$/game/Game'
import { GoogleTable } from '$/game/table/GoogleTable'

import { GameContext } from '$/bot/types'
import { enabledCommands } from '$/bot/commands'

export const commandsInMenu = enabledCommands.filter(
  ({ showInMenu }) => showInMenu
)

export const initBot = async (): Promise<Telegraf<GameContext>> => {
  const table = new GoogleTable(config.GOOGLE_SPREADSHEET_ID, config.GOOGLE_API_KEY)
  const game = new Game(table)
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

  bot.context.game = game

  enabledCommands.map((command) =>
    bot.command('/' + command.name, async ctx => {
      try {
        try {
          await ctx.telegram.getChatMember(config.TELEGRAM_HOME_CHAT_ID, ctx.from.id)
        } catch {
          void ctx.reply('🚫 Нет доступа')
          return
        }

        await command.handler(ctx)
      } catch (e) {
        logger.error(e)
        void ctx.reply('⚠️ Неожиданная ошибка. Повторите запрос позже.')
      }
    })
  )

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) => {
    void ctx.reply(
      '⚠️ Не удалось распознать команду. Используйте меню или команду /help'
    )
  })

  return bot
}

export const updateWebhook = async (bot: Telegraf<GameContext>): Promise<void> => {
  const { url: savedWebhook } = await bot.telegram.getWebhookInfo()

  if (config.WEBHOOK_FULL !== savedWebhook) {
    await bot.telegram.setWebhook(config.WEBHOOK_FULL, { allowed_updates: ['message'] })
  }
}
