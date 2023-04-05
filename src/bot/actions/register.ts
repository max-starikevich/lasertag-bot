import { chunk } from 'lodash'

import { Action, ActionHandler, ActionInitializer } from '../types'

const actionName = /^register-(\d+)$/

const initializer: ActionInitializer = async ctx => {
  const { game, lang, currentPlayer } = ctx

  if (currentPlayer !== undefined) {
    return await ctx.reply(lang.REGISTER_ALREADY_REGISTERED())
  }

  const players = (await game.getPlayers()).filter(({ isCompanion }) => !isCompanion)

  if (players.length === 0) {
    return await ctx.replyWithHTML(lang.NOT_ENOUGH_PLAYERS())
  }

  const chunkedPlayers = chunk(players, 2)

  await ctx.reply(lang.REGISTER_CHOOSE_YOURSELF(), {
    reply_markup: {
      inline_keyboard: chunkedPlayers.map(players => [
        ...players.filter(({ telegramUserId }) => telegramUserId === undefined).map(player => ({ text: `${player.name} ${player.clanEmoji ?? ''}`, callback_data: `register-${player.tableRow}` }))
      ])
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { game, lang } = ctx

  const tableRow = parseInt(ctx.match[1])

  if (ctx.from === undefined || Number.isNaN(tableRow)) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  const players = await game.getPlayers()
  const targetPlayer = players.find(player => player.tableRow === tableRow)

  if (targetPlayer === undefined) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  targetPlayer.telegramUserId = ctx.from.id
  await game.savePlayer(targetPlayer)

  return await ctx.reply(lang.REGISTER_SUCCESS({ name: targetPlayer.name }))
}

export const register: Action = {
  name: actionName,
  initializer,
  handler
}
