import { Telegraf } from 'telegraf'

import { BotContext } from '$/bot'
import { handleCommandError, ServiceError, UserError } from '$/errors'
import { trackUser } from '$/analytics'
import { initAndLoadDocument, loadSheet } from '$/sheets'
import { logger } from '$/logger'

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

const updateDocumentInContext = async (ctx: Partial<BotContext>): Promise<void> => {
  if (ctx.document == null) {
    ctx.document = await initAndLoadDocument()
    logger.info('📄 Updated document and sheets')
    return
  }

  const { document } = ctx

  void loadSheet(document.sheetsByIndex[0]).then(() => {
    logger.info('📄 Updated sheets in the background after a command')
  })
}

interface HandlerWrapperParams {
  ctx: BotContext
  command: BotCommand
  bot: Telegraf<BotContext>
}

const handlerWrapper = async ({ ctx, command, bot }: HandlerWrapperParams): Promise<void> => {
  try {
    const startMs = Date.now()

    if (ctx.message != null) {
      void trackUser({
        id: `${ctx.message.from.id}`,
        username: ctx.message.from.username,
        firstName: ctx.message.from.first_name,
        lastName: ctx.message.from.last_name
      })
    }

    const { requireDocument } = command

    if (requireDocument) {
      // ctx is a copy of bot.context on every bot.handleUpdate()
      await updateDocumentInContext(bot.context)
      Object.assign(ctx, bot.context)
    }

    await command.handler(ctx)

    const finishMs = Date.now() - startMs

    logger.info(`✅ Processed /${command.name} in ${finishMs}ms.`)
  } catch (e) {
    if (e instanceof UserError) {
      void ctx.reply(`❌ ${e.message}`)
      return
    }

    if (e instanceof ServiceError) {
      handleCommandError(e)
      void ctx.reply('❌ Ошибка системы. Повторите свой запрос позже.')
      return
    }

    handleCommandError(e as Error)
    void ctx.reply('❌ Неизвестная ошибка системы. Повторите свой запрос позже.')
  }
}

export const setBotCommands = async (bot: Telegraf<BotContext>): Promise<void> => {
  commands.map((command) =>
    bot.command('/' + command.name, async (ctx) => await handlerWrapper({ ctx, command, bot }))
  )

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) =>
    await ctx.reply(
      'Не удалось распознать команду. Используйте меню или команду /help'
    )
  )
}
