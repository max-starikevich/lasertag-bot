import { Telegraf } from 'telegraf'

import { BotContext } from '$/bot'
import { handleCommandError, ServiceError, ServiceErrorCodes, UserError } from '$/errors'
import { initAndLoadDocument, loadSheet } from '$/sheets'
import { logger } from '$/logger'
import { getLogData, trackUser, LogDataFromContext } from '$/context'

import help, { start } from '$/commands/help'
import playerlist from '$/commands/playerlist'
import randomTeams from '$/commands/randomteams'
import organizerdata from '$/commands/organizerdata'
import about from '$/commands/about'

export type BotCommandHandler = (ctx: BotContext) => Promise<any>

export interface BotCommand {
  name: string
  handler: BotCommandHandler
  description: string
  showInMenu: boolean
  requireDocument: boolean
}

const commands: BotCommand[] = [
  start,
  playerlist,
  organizerdata,
  randomTeams,
  help,
  about
]

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

const updateDocumentInContext = async (botContext: Partial<BotContext>, logData: LogDataFromContext): Promise<void> => {
  if (botContext.document == null) {
    const startMs = Date.now()
    botContext.document = await initAndLoadDocument()
    const finishMs = Date.now() - startMs

    logger.info(`📄 Updated document and sheets in ${finishMs}ms`, {
      ...logData, finishMs
    })

    return
  }

  const { document } = botContext

  const startMs = Date.now()
  await loadSheet(document.sheetsByIndex[0])
  const finishMs = Date.now() - startMs

  logger.info(`📄 Updated sheets in ${finishMs}ms`, {
    ...logData, finishMs
  })
}

interface HandlerWrapperParams {
  ctx: BotContext
  command: BotCommand
  bot: Telegraf<BotContext>
}

const handlerWrapper = async ({ ctx, command, bot }: HandlerWrapperParams): Promise<void> => {
  const startMs = Date.now()
  const userData = getLogData({ ctx, commandName: command.name })

  void trackUser(userData)

  try {
    if (ctx.message == null) {
      throw new ServiceError('Не удалось обработать сообщение.', ServiceErrorCodes.NO_MESSAGE_IN_CTX)
    }

    const { requireDocument } = command

    if (requireDocument) {
      // ctx is a copy of bot.context on every bot.handleUpdate()
      await updateDocumentInContext(bot.context, userData)
      Object.assign(ctx, bot.context)
    }

    await command.handler(ctx)

    const finishMs = Date.now() - startMs

    logger.info(`✅ Processed /${command.name} in ${finishMs}ms.`, {
      ...userData, finishMs
    })
  } catch (e) {
    const finishMs = Date.now() - startMs

    if (e instanceof ServiceError) {
      void ctx.reply(`❌ ${e.message}`)

      logger.error(`❌ Processed /${command.name} with a ServiceError ${e.code} code in ${finishMs}ms.`, {
        ...userData, errorCode: e.code, finishMs
      })

      handleCommandError(e)
      return
    }

    if (e instanceof UserError) {
      void ctx.reply(`⚠️ ${e.message}`)

      logger.warn(`⚠️  Processed /${command.name} with a UserError code ${e.code} in ${finishMs}ms.`, {
        ...userData, errorCode: e.code, finishMs
      })

      handleCommandError(e)
      return
    }

    const error = e as Error

    void ctx.reply('❌ Неизвестная ошибка системы. Повторите свой запрос позже.')

    logger.error(`❌ Processed /${command.name} with an unknown code in ${finishMs}ms.`, {
      ...userData, errorCode: null, finishMs
    })

    handleCommandError(error)
  }
}

export const setBotCommands = async (bot: Telegraf<BotContext>): Promise<void> => {
  commands.map((command) =>
    bot.command('/' + command.name, async (ctx) => await handlerWrapper({ ctx, command, bot }))
  )

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) => {
    const commandName = ctx.message.text
    const userData = getLogData({ ctx, commandName })

    void ctx.reply(
      '⚠️ Не удалось распознать команду. Используйте меню или команду /help'
    )

    logger.warn(`⚠️  Unknown ${commandName} command`, {
      ...userData
    })
  })
}
