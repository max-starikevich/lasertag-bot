import * as Sentry from '@sentry/node'

import { BotMiddleware } from '.'

export const analyticsMiddleware: BotMiddleware = async (ctx, next) => {
  Sentry.setUser({ ...ctx.from, id: ctx.from.id.toString() })
  return await next()
}
