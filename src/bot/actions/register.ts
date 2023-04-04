import { chunk } from 'lodash'

import { Action, ActionHandler, ActionInitializer } from '../types'

const actionName = /^register-(\d+)$/

const initializer: ActionInitializer = async ctx => {
  const { game, lang } = ctx

  const players = (await game.getPlayers()).filter(({ isCompanion }) => !isCompanion)

  if (players.length === 0) {
    return await ctx.replyWithHTML(lang.NOT_ENOUGH_PLAYERS())
  }

  const alreadyRegisteredPlayer = players.find(({ telegramUserId }) => telegramUserId !== undefined && telegramUserId === ctx.from.id)

  if (alreadyRegisteredPlayer !== undefined) {
    return await ctx.reply(lang.REGISTER_ALREADY_REGISTERED())
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

  if (Number.isNaN(tableRow)) {
    throw new Error(lang.ACTION_HANDLER_WRONG_DATA())
  }

  const player = await game.registerPlayer(tableRow, ctx.callbackQuery.from.id)

  return await ctx.reply(lang.REGISTER_SUCCESS({ name: player.name }))
}

export const register: Action = {
  name: actionName,
  initializer,
  handler
}
