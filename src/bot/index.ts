import { Telegraf } from 'telegraf'

import config from '$/config'
import { checkEnvironment } from '$/config/check'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotActions, setBotMiddlewares } from '$/bot/middleware'

import { Game } from '$/game'
import { GoogleTableGameStorage } from '$/game/storage/google-table'
import { reportException } from '$/errors'
import L from '$/lang/i18n-node'
import { defaultLocale } from '$/lang/i18n-custom'

import { errorMiddleware } from './middleware/error'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

export const initBot = async (): Promise<Telegraf<GameContext>> => {
  await checkEnvironment()

  const storage = new GoogleTableGameStorage({
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: config.GOOGLE_PRIVATE_KEY,
    playerSheetsId: config.PLAYERS_SHEETS_ID,
    gameSheetsId: config.GAME_SHEETS_ID
  })

  const game = new Game({ storage })
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

  bot.context.game = game

  // will be overriden in the access middleware
  bot.context.isAdmin = false
  bot.context.isCreator = false
  bot.context.isGroupChat = false
  bot.context.isPrivateChat = false

  bot.context.lang = L[defaultLocale]
  bot.context.locale = defaultLocale

  setBotMiddlewares(bot)
  setBotActions(bot)

  bot.catch(errorMiddleware)

  process.on('uncaughtException', e => reportException(e))
  process.on('unhandledRejection', e => reportException(e))

  return bot
}
