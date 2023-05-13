import { Telegraf } from 'telegraf'

import config from '$/config'
import { checkEnvironment } from '$/config/check'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotActions, setBotMiddlewares } from '$/bot/middleware'

import { Game } from '$/game/Game'
import { GoogleTableGameStorage } from '$/game/storage/google-table/GoogleTableGameStorage'
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
    players: {
      docId: config.PLAYERS_DOC_ID,
      sheetsId: config.PLAYERS_SHEETS_ID
    },
    game: {
      docId: config.GAME_DOC_ID,
      sheetsId: config.GAME_SHEETS_ID
    },
    links: {
      docId: config.LINKS_DOC_ID,
      sheetsId: config.LINKS_SHEETS_ID
    },
    stats: {
      docId: config.STATS_DOC_ID,
      sheetsId: config.STATS_SHEETS_ID
    },
    enroll: {
      docId: config.ENROLL_DOC_ID,
      sheetsId: config.ENROLL_SHEETS_ID,
      ranges: {
        names: config.ENROLL_NAMES_RANGE,
        count: config.ENROLL_COUNT_RANGE,
        rent: config.ENROLL_RENT_RANGE,
        comment: config.ENROLL_COMMENT_RANGE
      }
    }
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
