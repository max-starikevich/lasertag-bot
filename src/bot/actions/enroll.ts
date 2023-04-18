import { Action, ActionHandler, ActionInitializer } from '../types'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { chunk, range } from 'lodash'

const initializer: ActionInitializer = async ctx => {
  const { currentPlayer, lang } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  await ctx.reply(lang.COUNT(), {
    reply_markup: {
      inline_keyboard: chunk(
        [...range(0, 6).map(n => ({
          text: `${n}`,
          callback_data: `enroll-count-${n}`
        }))], 3
      )
    }
  })

  await ctx.reply(lang.RENT(), {
    reply_markup: {
      inline_keyboard: chunk(
        [...range(0, 6).map(n => ({
          text: `${n}`,
          callback_data: `enroll-rent-${n}`
        }))], 3
      )
    }
  })
}

const countHandler: ActionHandler = async ctx => {
  const { lang } = ctx

  await ctx.editMessageReplyMarkup(undefined)

  const count = ctx.match[1]

  if (Number.isNaN(count)) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  // TODO: call google sheets mutation here

  await ctx.editMessageText(`✅ ${lang.COUNT()}: ${count}`)
}

const rentHandler: ActionHandler = async ctx => {
  const { lang } = ctx

  await ctx.editMessageReplyMarkup(undefined)

  const rent = ctx.match[1]

  if (Number.isNaN(rent)) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  // TODO: call google sheets mutation here

  await ctx.editMessageText(`✅ ${lang.RENT()}: ${rent}`)
}

export const enroll: Action = {
  initializer,
  mapping: {
    '^enroll-count-(\\d+)$': countHandler,
    '^enroll-rent-(\\d+)$': rentHandler
  }
}
