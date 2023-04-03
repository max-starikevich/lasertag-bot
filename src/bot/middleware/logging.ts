import { MiddlewareFn } from 'telegraf'

import { makeLogger } from '$/logger'

import { GameContext } from '../types'

export const loggingMiddleware: MiddlewareFn<GameContext> = async (ctx, next) => {
  const startMs = performance.now()
  const logger = makeLogger(ctx.update.update_id.toString())

  ctx.logger = logger

  try {
    await next()
    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.info({
      update: ctx.update,
      timeElapsedMs,
      status: 'OK',
      memberStatus: ctx.memberStatus
    })
  } catch (e) {
    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.error({
      update: ctx.update,
      timeElapsedMs,
      status: 'ERROR',
      memberStatus: ctx.memberStatus
    })

    throw e
  }
}
