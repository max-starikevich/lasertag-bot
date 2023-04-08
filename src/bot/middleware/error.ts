import { reportException } from '$/errors'
import { CustomError } from '$/errors/CustomError'

import { GameContext } from '../types'

export const errorMiddleware = async (error: any, ctx: GameContext): Promise<void> => {
  const { logger } = ctx

  if (error == null) {
    return
  }

  if (error instanceof CustomError) {
    await handleCustomError(error, ctx)
    return
  }

  reportException(error)

  logger.error({
    update: ctx.update,
    error,
    memberStatus: ctx.memberStatus
  })

  void ctx.reply(`⚠️ ${ctx.lang.UNEXPECTED_ERROR_FOR_USER()}`)
}

const handleCustomError = async (error: CustomError, ctx: GameContext): Promise<void> => {
  if (error.shouldBeReported) {
    reportError(error.cause)

    const { logger } = ctx

    logger.error({
      update: ctx.update,
      error: error.cause?.message ?? error.cause,
      memberStatus: ctx.memberStatus
    })
  }

  void ctx.reply(`⚠️ ${error.replyMessage(ctx.lang)}`)
}
