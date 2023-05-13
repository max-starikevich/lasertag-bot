import { BotMiddleware } from '.'

import { isLocaleName } from '$/lang/i18n-custom'
import { Locales } from '$/lang/i18n-types'
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

  if (isLocaleName(currentPlayer.locale) === true) {
    ctx.locale = currentPlayer.locale as Locales
    ctx.lang = L[ctx.locale]
  }

  return await next()
}
