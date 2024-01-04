import { getPlayerLang } from '$/game/player'

import { BotMiddleware } from '.'

export const playerMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.from == null) {
    throw new Error('Missing "ctx.from"')
  }

  const { storage } = ctx

  const players = await storage.getPlayers()

  ctx.players = players

  const currentPlayer = players.find(({ telegramUserId }) => telegramUserId !== undefined && telegramUserId === ctx.from?.id)

  if (currentPlayer === undefined) {
    return await next()
  }

  ctx.currentPlayer = currentPlayer
  ctx.isAdmin = currentPlayer.isAdmin

  ctx.locale = currentPlayer.locale
  ctx.lang = getPlayerLang(currentPlayer)

  return await next()
}
