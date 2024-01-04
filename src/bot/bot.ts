import { Telegraf } from 'telegraf'
import ApiClient from 'telegraf/typings/core/network/client'

import config from '$/config'

import { AvailableTeamBalancers, GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotActions, setBotMiddlewares } from '$/bot/middleware'

import { IGameStorage, IGameStore } from '$/game/storage/types'

import L from '$/lang/i18n-node'
import { Locales } from '$/lang/i18n-types'

import { errorMiddleware } from './middleware/error'
import { CustomContext } from './CustomContext'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

interface BotParams {
  storage: IGameStorage
  store: IGameStore
  balancers: AvailableTeamBalancers
  token: string
  telegramApiOptions?: Partial<ApiClient.Options>
  locale?: Locales
}

export const initBot = ({ token, telegramApiOptions, storage, store, locale = config.DEFAULT_LOCALE, balancers }: BotParams): Telegraf<GameContext> => {
  const bot = new Telegraf<GameContext>(token, {
    // @ts-expect-error
    contextType: CustomContext,
    telegram: telegramApiOptions
  })

  bot.context.storage = storage
  bot.context.store = store
  bot.context.players = []
  bot.context.balancers = balancers

  // will be overriden in the access middleware
  bot.context.isAdminOfHomeChat = false
  bot.context.isCreatorOfHomeChat = false
  bot.context.isPrivateChat = false

  bot.context.isAdmin = false

  bot.context.lang = L[locale]
  bot.context.locale = locale

  setBotMiddlewares(bot)
  setBotActions(bot)

  bot.catch(errorMiddleware)

  return bot
}
