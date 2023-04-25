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
import { extractRange } from '../utils'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

export const initBot = async (): Promise<Telegraf<GameContext>> => {
  await checkEnvironment()

  const enrollNamesRange = extractRange(config.ENROLL_NAMES_RANGE)
  const enrollCountRange = extractRange(config.ENROLL_COUNT_RANGE)
  const enrollRentRange = extractRange(config.ENROLL_RENT_RANGE)

  if (enrollNamesRange === null || enrollCountRange === null || enrollRentRange === null) {
    throw new Error('Invalid enroll range data')
  }

  const storage = new GoogleTableGameStorage(
    config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    config.GOOGLE_PRIVATE_KEY,
    {
      docId: config.PLAYERS_DOC_ID,
      sheetsId: config.PLAYERS_SHEETS_ID
    },
    {
      docId: config.GAME_DOC_ID,
      sheetsId: config.GAME_SHEETS_ID
    },
    {
      docId: config.LINKS_DOC_ID,
      sheetsId: config.LINKS_SHEETS_ID
    },
    {
      docId: config.ENROLL_DOC_ID,
      sheetsId: config.ENROLL_SHEETS_ID,
      namesRange: enrollNamesRange,
      countRange: enrollCountRange,
      rentRange: enrollRentRange
    }
  )

  const game = new Game({ storage })
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

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

  bot.catch(errorMiddleware)

  process.on('uncaughtException', e => reportException(e))
  process.on('unhandledRejection', e => reportException(e))

  return bot
}
