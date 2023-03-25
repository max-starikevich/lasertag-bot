import { chunk } from 'lodash'

import { Action, ActionHandler, ActionInitializer } from '../types'

const actionName = /^register-(\d+)$/

const initializer: ActionInitializer = async ctx => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const players = (await game.getPlayers()).filter(({ isCompanion }) => !isCompanion)
  const chunkedPlayers = chunk(players, 1)

  await ctx.replyWithHTML(ctx.lang.REGISTER_CHOOSE_YOURSELF(), {
    reply_markup: {
      inline_keyboard: chunkedPlayers.map(players => [
        ...players.map(player => ({ text: `${player.name} ${player.clanEmoji ?? ''}`, callback_data: `register-${player.tableRow}` }))
      ])
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { game } = ctx

  const tableRow = ctx.match[1]

  const player = await game.registerPlayer(+tableRow, ctx.callbackQuery.from.id)

  return await ctx.reply(ctx.lang.REGISTER_SUCCESS({ name: player.name }))
}

export const register: Action = {
  name: actionName,
  initializer,
  handler
}
