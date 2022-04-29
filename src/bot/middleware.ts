import { Telegraf } from 'telegraf'

import { handleCommandError } from '$/errors'
import { ServiceError, ServiceErrorCodes } from '$/errors/ServiceError'
import { UserError } from '$/errors/UserError'

import { logger } from '$/logger'
import { ActionKind } from '$/logger/ActionKind'
import { initAndLoadDocument, loadSheet } from '$/services/Table'
import { BotCommand } from '$/bot/commands'
import { BotContext, LogDataFromContext, getLogData, trackUser } from '$/bot/context'

const updateDocumentInContext = async (botContext: Partial<BotContext>, logData: LogDataFromContext): Promise<void> => {
  if (botContext.document == null) {
    const startMs = Date.now()
    botContext.document = await initAndLoadDocument()
    const finishMs = Date.now() - startMs

    logger.info(`📄 Updated document and sheets in ${finishMs}ms`, {
      ...logData, finishMs, actionKind: ActionKind.DOCUMENT_LOADED
    })

    return
  }

  const { document } = botContext

  const startMs = Date.now()
  await loadSheet(document.sheetsByIndex[0])
  const finishMs = Date.now() - startMs

  logger.info(`📄 Updated sheets in ${finishMs}ms`, {
    ...logData, finishMs, actionKind: ActionKind.SHEETS_LOADED
  })
}

interface HandlerWrapperParams {
  ctx: BotContext
  command: BotCommand
  bot: Telegraf<BotContext>
}

export const handlerWrapper = async ({ ctx, command, bot }: HandlerWrapperParams): Promise<void> => {
  const startMs = Date.now()
  const logData = getLogData({ ctx, commandName: command.name })

  void trackUser(logData)

  try {
    if (ctx.message == null) {
      throw new ServiceError('Не удалось обработать сообщение.', ServiceErrorCodes.NO_MESSAGE_IN_CTX)
    }

    const { requireDocument } = command

    if (requireDocument) {
      // ctx is a copy of bot.context on every bot.handleUpdate()
      await updateDocumentInContext(bot.context, logData)
      Object.assign(ctx, bot.context)
    }

    await command.handler(ctx)

    const finishMs = Date.now() - startMs

    logger.info(`✅ Processed /${command.name} in ${finishMs}ms.`, {
      ...logData, finishMs, kind: ActionKind.PROCESSED_OK
    })
  } catch (e) {
    const finishMs = Date.now() - startMs

    if (e instanceof ServiceError) {
      void ctx.reply(`❌ ${e.message}`)

      logger.error(`❌ Processed /${command.name} with a ServiceError ${e.code} code in ${finishMs}ms.`, {
        ...logData, errorCode: e.code, finishMs, kind: ActionKind.PROCESSED_NOT_OK
      })

      handleCommandError(e)
      return
    }

    if (e instanceof UserError) {
      void ctx.reply(`⚠️ ${e.message}`)

      logger.warn(`⚠️  Processed /${command.name} with a UserError code ${e.code} in ${finishMs}ms.`, {
        ...logData, errorCode: e.code, finishMs, kind: ActionKind.PROCESSED_NOT_OK
      })

      handleCommandError(e)
      return
    }

    const error = e as Error

    void ctx.reply('❌ Неизвестная ошибка системы. Повторите свой запрос позже.')

    logger.error(`❌ Processed /${command.name} with an unknown code in ${finishMs}ms.`, {
      ...logData, errorCode: 'unknown', finishMs, kind: ActionKind.PROCESSED_NOT_OK
    })

    handleCommandError(error)
  }
}
