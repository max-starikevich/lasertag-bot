import { Telegraf } from 'telegraf'

import config from '$/config'
import { checkEnvironment } from '$/config/check'

import { Game } from '$/game/Game'
import { GoogleTable } from '$/game/table/GoogleTable'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotMiddlewares } from '$/bot/middleware'
import { reportException } from '$/errors'

import L from '$/lang/i18n-node'

const PLAYER_DATA_TABLE_RANGES = [
  config.NAME_COLUMN,
  config.RATING_COLUMN,
  config.CLAN_COLUMN,
  config.COUNT_COLUMN,
  config.RENT_COLUMN,
  config.COMMENT_COLUMN
].map((column) => `${column}${config.START_FROM_ROW}:${column}${config.MAX_ROW_NUMBER}`)

const ALL_TABLE_RANGES_TO_LOAD = [...PLAYER_DATA_TABLE_RANGES, ...config.PLACE_AND_TIME_CELLS]

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

export const initBot = async (): Promise<Telegraf<GameContext>> => {
  await checkEnvironment()

  const table = new GoogleTable({
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: config.GOOGLE_PRIVATE_KEY,
    rangesToLoad: ALL_TABLE_RANGES_TO_LOAD
  })

  const game = new Game(table)
  const bot = new Telegraf<GameContext>(config.BOT_TOKEN)

  bot.context.game = game

  // will be overriden in the access middleware
  bot.context.isAdmin = false
  bot.context.isCreator = false
  bot.context.isGroupChat = false
  bot.context.isPrivateChat = false

  bot.context.lang = L.ru

  setBotMiddlewares(bot)

  process.on('uncaughtException', e => reportException(e))
  process.on('unhandledRejection', e => reportException(e))

  return bot
}
