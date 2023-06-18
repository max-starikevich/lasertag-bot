import * as Sentry from '@sentry/node'

import { BotMiddleware } from '.'

export const analyticsMiddleware: BotMiddleware = async (ctx, next) => {
  if (ctx.from == null) {
    throw new Error('Missing "ctx.chat" and "ctx.from"')
  }

  Sentry.setUser({
    ...ctx.from,
    id: ctx.from.id.toString()
  })

  Sentry.setExtra('update', JSON.stringify(ctx.update))

  return await next()
}
