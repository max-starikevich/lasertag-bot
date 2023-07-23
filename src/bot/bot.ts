import { Telegraf } from 'telegraf'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotActions, setBotMiddlewares } from '$/bot/middleware'

import { GameStorage, GameStore } from '$/game/storage/types'
import L from '$/lang/i18n-node'
import { defaultLocale } from '$/lang/i18n-custom'

import { errorMiddleware } from './middleware/error'
import { CustomContext } from './CustomContext'
import ApiClient from 'telegraf/typings/core/network/client'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

interface InitBotParams {
  storage: GameStorage
  store: GameStore
  token: string
  telegram?: Partial<ApiClient.Options>
}

export const initBot = async ({ token, telegram, storage, store }: InitBotParams): Promise<Telegraf<GameContext>> => {
  const bot = new Telegraf<GameContext>(token, {
    // @ts-expect-error
    contextType: CustomContext,
    telegram
  })

  bot.context.storage = storage
  bot.context.store = store
  bot.context.players = []

  // will be overriden in the access middleware
  bot.context.isAdminInHomeChat = false
  bot.context.isCreatorOfHomeChat = false
  bot.context.isPrivateChat = false

  bot.context.lang = L[defaultLocale]
  bot.context.locale = defaultLocale

  setBotMiddlewares(bot)
  setBotActions(bot)

  bot.catch(errorMiddleware)

  return bot
}
