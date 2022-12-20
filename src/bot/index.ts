import { Telegraf } from 'telegraf'

import config from '$/config'

import { Game } from '$/game/Game'
import { GoogleTable } from '$/game/table/GoogleTable'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotMiddlewares } from '$/bot/middleware'
import { reportException } from '$/errors'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

export const initBot = async (): Promise<Telegraf<GameContext>> => {
  const table = new GoogleTable(config.GOOGLE_SPREADSHEET_ID, config.GOOGLE_API_KEY)
  const game = new Game(table)
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

  bot.context.game = game

  // may be overriden in middlewares
  bot.context.isAdmin = false
  bot.context.isCreator = false

  setBotMiddlewares(bot)

  process.on('uncaughtException', e => reportException(e))
  process.on('unhandledRejection', e => reportException(e))

  return bot
}
