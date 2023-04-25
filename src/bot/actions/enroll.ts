import { Action, ActionHandler, ActionInitializer } from '../types'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { chunk, pick, range } from 'lodash'

const initializer: ActionInitializer = async ctx => {
  const { currentPlayer, lang } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  await ctx.reply(`${lang.COUNT()}?`, {
    reply_markup: {
      inline_keyboard: chunk(
        [...range(0, 6).map(n => ({
          text: `${n === 0 ? lang.ABSENT() : n}`,
          callback_data: `enroll-count-${n}`
        }))], 2
      )
    }
  })

  await ctx.reply(`${lang.RENT()}?`, {
    reply_markup: {
      inline_keyboard: chunk(
        [...range(0, 6).map(n => ({
          text: `${n}`,
          callback_data: `enroll-rent-${n}`
        }))], 2
      )
    }
  })
}

const countHandler: ActionHandler = async ctx => {
  const { lang, currentPlayer, game } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const count = parseInt(ctx.match[1])

  if (Number.isNaN(count)) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  currentPlayer.count = count

  await ctx.editMessageText(`⌛ ${lang.COUNT()}: ${count}`)

  await game.savePlayer({
    ...pick(currentPlayer, ['tableRow', 'name']),
    count
  })

  await ctx.editMessageText(`✅ ${lang.COUNT()}: ${count}`)
}

const rentHandler: ActionHandler = async ctx => {
  const { lang, currentPlayer, game } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const rentCount = parseInt(ctx.match[1])

  if (Number.isNaN(rentCount)) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  currentPlayer.rentCount = rentCount

  await ctx.editMessageText(`⌛ ${lang.RENT()}: ${rentCount}`)

  await game.savePlayer({
    ...pick(currentPlayer, ['tableRow', 'name']),
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