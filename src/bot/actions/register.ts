import { chunk } from 'lodash'

import { stringToSha1 } from '$/utils'
import { NoFreeRowsToRegisterError } from '$/errors/NoFreeRowsToRegisterError'

import { Action, ActionHandler, ActionInitializer } from '../types'

export const initializer: ActionInitializer = async ctx => {
  const { players, lang, currentPlayer } = ctx

  if (currentPlayer !== undefined) {
    return await ctx.reply(lang.REGISTER_ALREADY_REGISTERED())
  }

  const nonRegisteredPlayers = players
    .filter(({ telegramUserId }) => telegramUserId === undefined)

  if (nonRegisteredPlayers.length === 0) {
    throw new NoFreeRowsToRegisterError()
  }

  const chunkedPlayers = chunk(nonRegisteredPlayers, 2)

  await ctx.reply(lang.REGISTER_CHOOSE_YOURSELF(), {
    reply_markup: {
      inline_keyboard: chunkedPlayers.map(players => [
        ...players.map(player =>
          ({
            text: `${player.name} ${player.clanEmoji ?? ''}`,
            callback_data: `register-${stringToSha1(player.name)}`
          })
        )
      ])
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { players, lang, getStorage } = ctx

  if (ctx.from === undefined) {
    throw new Error('Missing "ctx.from"')
  }

  const storage = await getStorage()

  const playerHash = String(ctx.match[1])

  if (playerHash.length === 0) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  const targetPlayer = players.find(player => stringToSha1(player.name) === playerHash)

  if (targetPlayer === undefined) {
    return await ctx.reply(lang.ACTION_HANDLER_WRONG_DATA())
  }

  const alreadyRegisteredPlayer = players.find(({ telegramUserId }) => telegramUserId === ctx.from?.id)

  if (alreadyRegisteredPlayer !== undefined) {
    return await ctx.reply(lang.REGISTER_ALREADY_REGISTERED())
  }

  ctx.currentPlayer = targetPlayer

  await storage.savePlayer(ctx.currentPlayer.name, {
    telegramUserId: ctx.from.id
  })

  await ctx.editMessageText(`✅ ${lang.REGISTER_SUCCESS({ name: targetPlayer.name })}`)
}

export const register: Action = {
  mapping: {
    '^register-(\\w+)$': handler
  }
}
