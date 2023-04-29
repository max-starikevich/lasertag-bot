import { chunk } from 'lodash'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'

import { Action, ActionHandler, ActionInitializer } from '../types'

const initializer: ActionInitializer = async ctx => {
  const { game, lang, currentPlayer } = ctx

  if (currentPlayer !== undefined) {
    return await ctx.reply(lang.REGISTER_ALREADY_REGISTERED())
  }

  const nonRegisteredPlayers = (await game.getPlayers()).filter(({ telegramUserId }) => telegramUserId === undefined)

  if (nonRegisteredPlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  const chunkedPlayers = chunk(nonRegisteredPlayers, 2)

  await ctx.reply(lang.REGISTER_CHOOSE_YOURSELF(), {
    reply_markup: {
      inline_keyboard: chunkedPlayers.map(players => [
        ...players.map(player =>
          ({
            text: `${player.name} ${player.clanEmoji ?? ''}`,
            callback_data: `register-${player.tableRow}`
          })
        )
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

  const alreadyRegisteredPlayer = players.find(({ telegramUserId }) => telegramUserId === ctx.from?.id)

  if (alreadyRegisteredPlayer !== undefined) {
    return await ctx.reply(lang.REGISTER_ALREADY_REGISTERED())
  }

  ctx.currentPlayer = targetPlayer

  await game.savePlayer(ctx.currentPlayer.name, {
    telegramUserId: ctx.from.id
  })

  await ctx.editMessageText(`✅ ${lang.REGISTER_SUCCESS({ name: targetPlayer.name })}`)
}

export const register: Action = {
  initializer,
  mapping: {
    '^register-(\\d+)$': handler
  }
}
