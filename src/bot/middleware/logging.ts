import { BotMiddleware } from '.'
import { makeLogger } from '../../logger'

export const loggingMiddleware: BotMiddleware = async (ctx, next) => {
  const startMs = performance.now()
  const logger = makeLogger(ctx.update.update_id.toString())

  ctx.logger = logger

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
