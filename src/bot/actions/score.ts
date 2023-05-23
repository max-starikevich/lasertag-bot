import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Action, ActionHandler, ActionInitializer } from '../types'

const initializer: ActionInitializer = async ctx => {
  const { currentPlayer, lang } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  await ctx.reply(lang.STATS_WHO_WON(), {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🔴',
          callback_data: 'score-1'
        },
        {
          text: '🔵',
          callback_data: 'score-2'
        }
      ]]
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { currentPlayer, lang } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  // TODO: implement stats saving here

  await ctx.editMessageText(`✅ ${lang.STATS_SAVE_SUCCESS()}`)
}

export const score: Action = {
  initializer,
  mapping: {
    '^score-(\\w+)$': handler
  }
}
