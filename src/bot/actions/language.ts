import { isLocaleName, localeNames } from '$/lang/i18n-custom'
import { Locales } from '$/lang/i18n-types'
import L from '$/lang/i18n-node'

import { register } from '$/bot/commands/register'

import { Action, ActionHandler, ActionInitializer } from '../types'

const actionName = /^set-language-(\w+)$/

const initializer: ActionInitializer = async ctx => {
  const { lang, currentPlayer } = ctx

  if (currentPlayer === undefined) {
    return await ctx.reply(ctx.lang.REGISTER_REQUIRED({ registerCommandName: register.name }))
  }

  await ctx.reply(lang.LANGUAGE_CHOOSE(), {
    reply_markup: {
      inline_keyboard: [[
        ...localeNames.map(locale => ({
          text: locale,
          callback_data: `set-language-${locale}`
        }))
      ]]
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { game, currentPlayer } = ctx

  if (currentPlayer === undefined) {
    return await ctx.reply(ctx.lang.REGISTER_REQUIRED({ registerCommandName: register.name }))
  }

  const localeToSet = ctx.match[1] as Locales

  if (ctx.from === undefined || isLocaleName(localeToSet) !== true) {
    return await ctx.reply(ctx.lang.ACTION_HANDLER_WRONG_DATA())
  }

  currentPlayer.locale = localeToSet

  await game.savePlayer(currentPlayer)

  ctx.locale = localeToSet
  ctx.lang = L[ctx.locale]

  await ctx.reply(ctx.lang.LANGUAGE_CHOOSE_SUCCESS())
}

export const language: Action = {
  name: actionName,
  initializer,
  handler
}
