import { chunk } from 'lodash'

import { Action, ActionHandler, ActionInitializer } from '../types'

const actionName = /^register-(\d+)$/

const initializer: ActionInitializer = async ctx => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const players = (await game.getPlayers()).filter(({ isCompanion }) => !isCompanion)

  if (players.length === 0) {
    return await ctx.replyWithHTML('No players.')
  }

  const alreadyRegisteredPlayer = players.find(({ telegramUserId }) => telegramUserId !== undefined && telegramUserId === ctx.from.id)

  if (alreadyRegisteredPlayer !== undefined) {
    return await ctx.reply(ctx.lang.REGISTER_ALREADY_REGISTERED())
  }

  const chunkedPlayers = chunk(players, 2)

  await ctx.reply(ctx.lang.REGISTER_CHOOSE_YOURSELF(), {
    reply_markup: {
      inline_keyboard: chunkedPlayers.map(players => [
        ...players.filter(({ telegramUserId }) => telegramUserId === undefined).map(player => ({ text: `${player.name} ${player.clanEmoji ?? ''}`, callback_data: `register-${player.tableRow}` }))
      ])
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { game } = ctx

  const tableRow = parseInt(ctx.match[1])

  if (Number.isNaN(tableRow)) {
    throw new Error('Register handler data is wrong.')
  }

  const player = await game.registerPlayer(tableRow, ctx.callbackQuery.from.id)

  return await ctx.reply(ctx.lang.REGISTER_SUCCESS({ name: player.name }))
}

export const register: Action = {
  name: actionName,
  initializer,
  handler
}
