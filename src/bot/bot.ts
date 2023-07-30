import { Telegraf } from 'telegraf'
import ApiClient from 'telegraf/typings/core/network/client'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotActions, setBotMiddlewares } from '$/bot/middleware'

import { GameStorage, GameStore } from '$/game/storage/types'
import L from '$/lang/i18n-node'
import { defaultLocale } from '$/lang/i18n-custom'

import { errorMiddleware } from './middleware/error'
import { CustomContext } from './CustomContext'
import { Locales } from '$/lang/i18n-types'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

interface InitBotParams {
  storage: GameStorage
  store: GameStore
  token: string
  telegramApiOptions?: Partial<ApiClient.Options>
  locale?: Locales
}

export const initBot = async ({ token, telegramApiOptions, storage, store, locale = defaultLocale }: InitBotParams): Promise<Telegraf<GameContext>> => {
  const bot = new Telegraf<GameContext>(token, {
    // @ts-expect-error
    contextType: CustomContext,
    telegram: telegramApiOptions
  })

  bot.context.storage = storage
  bot.context.store = store
  bot.context.players = []

  // will be overriden in the access middleware
  bot.context.isAdminInHomeChat = false
  bot.context.isCreatorOfHomeChat = false
  bot.context.isPrivateChat = false

  bot.context.lang = L[locale]
  bot.context.locale = locale

  setBotMiddlewares(bot)
  setBotActions(bot)

  bot.catch(errorMiddleware)

  return bot
}
