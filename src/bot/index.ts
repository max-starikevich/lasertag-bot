import { Telegraf } from 'telegraf'

import config from '$/config'
import { checkEnvironment } from '$/config/check'

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
  await checkEnvironment()

  const table = new GoogleTable({
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: config.GOOGLE_PRIVATE_KEY
  })

  const game = new Game(table)
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

  bot.context.game = game

  // may be overriden in middlewares
  bot.context.isAdmin = false
  bot.context.isCreator = false

  setBotMiddlewares(bot)

  await bot.telegram.setMyCommands(commandsInMenu.map(({ name, description }) => ({
    command: name,
    description
  })))

  process.on('uncaughtException', e => reportException(e))
  process.on('unhandledRejection', e => reportException(e))

  return bot
}
