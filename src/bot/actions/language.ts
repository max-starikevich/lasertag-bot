import { extractLocale, localeNames } from '$/lang/i18n-custom'
import L from '$/lang/i18n-node'
import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Action, ActionHandler, ActionInitializer } from '../types'
import { updateBotCommands } from '$/bot/webhooks'

export const initializer: ActionInitializer = async ctx => {
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
  const { currentPlayer, getStorage } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  if (ctx.from === undefined) {
    throw new Error('Missing "ctx.from"')
  }

  const storage = await getStorage()

  const locale = extractLocale(ctx.match[1])

  if (locale === undefined) {
    return await ctx.reply(ctx.lang.ACTION_HANDLER_WRONG_DATA())
  }

  currentPlayer.locale = locale

  await storage.savePlayer(currentPlayer.name, {
    locale
  })

  ctx.lang = L[locale]
  ctx.locale = locale

  await updateBotCommands(ctx, { type: 'chat', chat_id: ctx.from.id })
  await ctx.editMessageText(`✅ ${ctx.lang.LANGUAGE_CHOOSE_SUCCESS()}`)
}

export const language: Action = {
  mapping: {
    '^set-language-(\\w+)$': handler
  }
}
