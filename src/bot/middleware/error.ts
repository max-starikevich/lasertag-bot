import { reportException as reportError } from '$/errors'
import { CustomError } from '$/errors/CustomError'
import { NoHomeChatAccessError } from '../../errors/NoHomeChatAccessError'

import { GameContext } from '../types'

export const errorMiddleware = async (error: any, ctx: GameContext): Promise<void> => {
  const { logger } = ctx

  if (error == null) {
    return
  }

  if (error instanceof NoHomeChatAccessError) {
    void ctx.reply(`⚠️ ${error.replyMessage(ctx.lang)}`)
    return
  }

  if (error instanceof CustomError) {
    await handleCustomError(error, ctx)
    return
  }

  reportError(error)

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
  }

  const { logger } = ctx

  logger.error({
    update: ctx.update,
    error: error.cause?.message ?? error.cause,
    memberStatus: ctx.memberStatus
  })

  if (error.replyMessage(ctx.lang) != null) {
    void ctx.reply(`⚠️ ${error.replyMessage(ctx.lang)}`)
    return
  }

  void ctx.reply(`⚠️ ${ctx.lang.UNEXPECTED_ERROR_FOR_USER()}`)
}
