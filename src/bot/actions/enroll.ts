import { Action, ActionHandler, ActionInitializer } from '../types'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { chunk, range } from 'lodash'

const initializer: ActionInitializer = async ctx => {
  const { currentPlayer, lang } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  await ctx.reply(`${lang.COUNT()}?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: lang.ABSENT(),
            callback_data: 'enroll-count-0'
          }
        ],
        ...chunk(
          [...range(1, 10).map(n => ({
            text: `${n}`,
            callback_data: `enroll-count-${n}`
          }))], 3
        )
      ]
    }
  })

  await ctx.reply(`${lang.RENT()}?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: lang.RENT_NOT_NEEDED(),
            callback_data: 'enroll-rent-0'
          }
        ],
        ...chunk(
          [...range(1, 10).map(n => ({
            text: `${n}`,
            callback_data: `enroll-rent-${n}`
          }))], 3
        )
      ]
    }
  })
}

const countHandler: ActionHandler = async ctx => {
  const { lang, currentPlayer, storage } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const count = parseInt(ctx.match[1])

  if (Number.isNaN(count)) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  currentPlayer.count = count

  await ctx.editMessageText(`⌛ ${lang.COUNT()}: ${count}`)

  await storage.savePlayer(currentPlayer.name, {
    count
  })

  await ctx.editMessageText(`✅ ${lang.COUNT()}: ${count}`)
}

const rentHandler: ActionHandler = async ctx => {
  const { lang, currentPlayer, storage } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const rentCount = parseInt(ctx.match[1])

  if (Number.isNaN(rentCount)) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  currentPlayer.rentCount = rentCount

  await ctx.editMessageText(`⌛ ${lang.RENT()}: ${rentCount}`)

  await storage.savePlayer(currentPlayer.name, {
    rentCount
  })

  await ctx.editMessageText(`✅ ${lang.RENT()}: ${rentCount}`)
}

export const enroll: Action = {
  initializer,
  mapping: {
    '^enroll-count-(\\d+)$': countHandler,
    '^enroll-rent-(\\d+)$': rentHandler
  }
}
