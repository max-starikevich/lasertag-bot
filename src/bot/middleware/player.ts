import { BotMiddleware } from '.'

import L from '$/lang/i18n-node'

export const playerMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.from == null) {
    throw new Error('Missing "ctx.from"')
  }

  const { game } = ctx

  const players = await game.getPlayers()

  const currentPlayer = players.find(({ telegramUserId }) => telegramUserId !== undefined && telegramUserId === ctx.from?.id)

  if (currentPlayer === undefined) {
    return await next()
  }

  ctx.currentPlayer = currentPlayer
  ctx.locale = currentPlayer.locale
  ctx.lang = L[ctx.locale]

  return await next()
}
