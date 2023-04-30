import { isLocaleName, localeNames } from '$/lang/i18n-custom'
import { Locales } from '$/lang/i18n-types'
import L from '$/lang/i18n-node'
import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Action, ActionHandler, ActionInitializer } from '../types'
import { updateBotCommands } from '$/bot/webhooks'

const initializer: ActionInitializer = async ctx => {
  const { lang, currentPlayer } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
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
    throw new RegisterRequiredError()
  }

  const locale = ctx.match[1] as Locales

  if (ctx.chat === undefined || ctx.from === undefined || isLocaleName(locale) !== true) {
    return await ctx.reply(ctx.lang.ACTION_HANDLER_WRONG_DATA())
  }

  currentPlayer.locale = locale

  await game.savePlayer(currentPlayer.name, {
    locale
  })

  ctx.locale = locale
  ctx.lang = L[ctx.locale]

  await updateBotCommands(ctx, { type: 'chat', chat_id: ctx.from.id })
  await ctx.editMessageText(`✅ ${ctx.lang.LANGUAGE_CHOOSE_SUCCESS()}`)
}

export const language: Action = {
  initializer,
  mapping: {
    '^set-language-(\\w+)$': handler
  }
}
