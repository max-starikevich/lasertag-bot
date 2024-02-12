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

import { FeatureFactories } from '../features/types'

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

interface BotParams {
  token?: string
  telegramApiOptions?: Partial<ApiClient.Options>
  locale?: Locales
  factories: FeatureFactories
}

export const initBot = ({
  token = config.BOT_TOKEN,
  locale = config.DEFAULT_LOCALE,
  telegramApiOptions,
  factories
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

  bot.context.factories = factories

  setBotMiddlewares(bot)
  setBotActions(bot)

  bot.catch(errorMiddleware)

  return bot
}
