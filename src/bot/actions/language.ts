import { isLocaleName, localeNames } from '$/lang/i18n-custom'
import { Locales } from '$/lang/i18n-types'
import L from '../../lang/i18n-node'

import { Action, ActionHandler, ActionInitializer } from '../types'

const actionName = /^set-language-(\w+)$/

const initializer: ActionInitializer = async ctx => {
  const { lang } = ctx

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
  const localeToSet = ctx.match[1] as Locales

  if (isLocaleName(localeToSet) !== true) {
    throw new Error(ctx.lang.ACTION_HANDLER_WRONG_DATA())
  }

  ctx.locale = localeToSet
  ctx.lang = L[ctx.locale]

  await ctx.reply(ctx.lang.LANGUAGE_CHOOSE_SUCCESS())
}

export const language: Action = {
  name: actionName,
  initializer,
  handler
}
