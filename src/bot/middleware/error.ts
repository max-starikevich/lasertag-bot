import { reportException as reportError } from '$/errors'
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

  reportError(error)

  logger.error({
    update: ctx.update, error
  })

  void ctx.reply('⚠️ Неожиданная ошибка. Повторите запрос позже.')
}

const handleCustomError = async (error: CustomError, ctx: GameContext): Promise<void> => {
  if (error.shouldBeReported) {
    reportError(error.cause)
  }

  const { logger } = ctx

  logger.error({
    update: ctx.update, error: error.cause?.message ?? error.cause
  })

  if (error.replyMessage != null) {
    void ctx.reply(`⚠️ ${error.replyMessage}`)
    return
  }

  void ctx.reply('⚠️ Неожиданная ошибка. Повторите запрос позже.')
}
