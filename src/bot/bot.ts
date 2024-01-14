import { Telegraf } from 'telegraf'
import ApiClient from 'telegraf/typings/core/network/client'

import { config } from '$/config'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotActions, setBotMiddlewares } from '$/bot/middleware'

import L from '$/lang/i18n-node'
import { Locales } from '$/lang/i18n-types'

import { errorMiddleware } from './middleware/error'
import { CustomContext } from './CustomContext'

import { IKeyValueStore } from '$/features/key-value/types'
import { IGameStorage } from '$/features/players/storage/types'
import { ITeamBalancer } from '$/features/players/types'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

interface BotParams {
  token?: string
  telegramApiOptions?: Partial<ApiClient.Options>
  locale?: Locales

  getStorage: () => Promise<IGameStorage>
  getKeyValueStore: () => Promise<IKeyValueStore>

  getNoClansBalancer: () => Promise<ITeamBalancer>
  getClansBalancer: () => Promise<ITeamBalancer>
  getChatGptBalancer: () => Promise<ITeamBalancer>
}

export const initBot = ({
  token = config.BOT_TOKEN,
  locale = config.DEFAULT_LOCALE,
  telegramApiOptions,
  getStorage, getKeyValueStore, getNoClansBalancer, getClansBalancer, getChatGptBalancer
}: BotParams): Telegraf<GameContext> => {
  const bot = new Telegraf<GameContext>(token, {
    // @ts-expect-error
    contextType: CustomContext,
    telegram: telegramApiOptions
  })

  // will be overriden in the middleware
  bot.context.isAdminOfHomeChat = false
  bot.context.isCreatorOfHomeChat = false
  bot.context.isPrivateChat = false
  bot.context.players = []
  bot.context.isAdminPlayer = false

  bot.context.lang = L[locale]
  bot.context.locale = locale

  bot.context.getStorage = getStorage
  bot.context.getKeyValueStore = getKeyValueStore
  bot.context.getNoClansBalancer = getNoClansBalancer
  bot.context.getClansBalancer = getClansBalancer
  bot.context.getChatGptBalancer = getChatGptBalancer

  setBotMiddlewares(bot)
  setBotActions(bot)

  bot.catch(errorMiddleware)

  return bot
}
