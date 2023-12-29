import { Telegraf } from 'telegraf'
import ApiClient from 'telegraf/typings/core/network/client'

import config from '$/config'
import { checkEnvironment } from '$/config/check'

import { GameContext } from '$/bot/types'
import { commands } from '$/bot/commands'
import { setBotActions, setBotMiddlewares } from '$/bot/middleware'

import { GameStorage, GameStore } from '$/game/storage/types'
import { AiSkillBalancer } from '$/game/ai'

import L from '$/lang/i18n-node'
import { Locales } from '$/lang/i18n-types'

import { errorMiddleware } from './middleware/error'
import { CustomContext } from './CustomContext'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

interface InitBotParams {
  storage: GameStorage
  store: GameStore
  aiBalancer: AiSkillBalancer
  token: string
  telegramApiOptions?: Partial<ApiClient.Options>
  locale?: Locales
}

export const initBot = async ({ token, telegramApiOptions, storage, store, aiBalancer, locale = config.DEFAULT_LOCALE }: InitBotParams): Promise<Telegraf<GameContext>> => {
  await checkEnvironment()

  const bot = new Telegraf<GameContext>(token, {
    // @ts-expect-error
    contextType: CustomContext,
    telegram: telegramApiOptions
  })

  bot.context.storage = storage
  bot.context.store = store
  bot.context.aiBalancer = aiBalancer
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
