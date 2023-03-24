import { chunk } from 'lodash'

import { Action, ActionHandler, ActionInitializer } from '../types'

const actionName = /^register-(\d+)$/

const initializer: ActionInitializer = async ctx => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const players = (await game.getPlayers()).filter(({ isCompanion }) => !isCompanion)

  const chunkedPlayers = chunk(players, 2)

  await ctx.replyWithHTML('Make register action', {
    reply_markup: {
      inline_keyboard: chunkedPlayers.map(players => [
        ...players.map(player => ({ text: player.name, callback_data: `register-${player.tableRow}` }))
      ])
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { game } = ctx

  const tableRow = ctx.match[1]

  await game.registerPlayer(+tableRow, ctx.callbackQuery.from.id)

  return await ctx.reply('OK')
}

export const register: Action = {
  name: actionName,
  initializer,
  handler
}
