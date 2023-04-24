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
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: config.GOOGLE_PRIVATE_KEY,

    playerDocId: config.PLAYERS_DOC_ID,
    playerSheetsId: config.PLAYERS_SHEETS_ID,

    gameDocId: config.GAME_DOC_ID,
    gameSheetsId: config.GAME_SHEETS_ID,

    linksDocId: config.LINKS_DOC_ID,
    linksSheetsId: config.LINKS_SHEETS_ID,

    enrollDocId: config.ENROLL_DOC_ID,
    enrollSheetsId: config.ENROLL_SHEETS_ID
  })

  const game = new Game({ storage })
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

  bot.catch(errorMiddleware)

  process.on('uncaughtException', e => reportException(e))
  process.on('unhandledRejection', e => reportException(e))

  await storage.init()

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

  return bot
}
