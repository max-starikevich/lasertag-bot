import { getPlayerLang } from '$/features/players/utils'
import { BotMiddleware } from '.'

export const playerMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.from === undefined) {
    throw new Error('Missing "ctx.from"')
  }

  const { factories: { storageFactory } } = ctx

  const storage = await storageFactory()

  const players = await storage.getPlayers()

  ctx.players = players

  const currentPlayer = players.find(({ telegramUserId }) => telegramUserId !== undefined && telegramUserId === ctx.from?.id)

  if (currentPlayer === undefined) {
    return await next()
  }

  ctx.currentPlayer = currentPlayer
  ctx.isAdminPlayer = currentPlayer.isAdmin

  ctx.locale = currentPlayer.locale
  ctx.lang = getPlayerLang(currentPlayer)

  return await next()
}
