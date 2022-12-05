import { Telegraf } from 'telegraf'

import config from '$/config'

import { Game } from '$/game/Game'
import { GoogleTable } from '$/game/table/GoogleTable'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotMiddlewares } from '$/bot/middleware'
import { captureException } from '$/errors'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

export const initBot = async (): Promise<Telegraf<GameContext>> => {
  const table = new GoogleTable(config.GOOGLE_SPREADSHEET_ID, config.GOOGLE_API_KEY)
  const game = new Game(table)
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

  bot.context.game = game
  bot.context.isAdmin = false // may be overriden in middlewares

  setBotMiddlewares(bot)

  process.on('uncaughtException', e => captureException(e))
  process.on('unhandledRejection', e => captureException(e))

  return bot
}
