import { MiddlewareFn } from 'telegraf'

import { logger } from '$/logger'

import { GameContext } from '../types'

export const loggingMiddleware: MiddlewareFn<GameContext> = async (ctx, next) => {
  const startMs = performance.now()

  try {
    await next()
    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.info({
      update: ctx.update,
      timeElapsedMs,
      status: 'OK'
    })
  } catch (e) {
    const timeElapsedMs = Math.round(performance.now() - startMs)

    logger.info({
      update: ctx.update,
      timeElapsedMs,
      status: 'ERROR'
    })

    throw e
  }
}
