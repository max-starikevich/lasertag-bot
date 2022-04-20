import { Telegraf } from 'telegraf'

import { BotContext } from '$/bot'
import { handleCommandError, UserError } from '$/errors'
import { logger } from '$/logger'
import { trackUser } from '$/analytics'
import { initAndLoadDocument, loadSheet } from '$/sheets'
import { getDateDiffInSeconds } from '$/utils'
import config from '$/config'

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

interface BotHandlerWrapperOptions {
  command: BotCommand
  ctx: BotContext
  bot: Telegraf<BotContext>
}

const updateDocumentInContext = async (bot: Telegraf<BotContext>): Promise<void> => {
  if (bot.context.document == null) {
    bot.context.document = await initAndLoadDocument()
  }

  const { document, sheetLastUpdate } = bot.context

  if (sheetLastUpdate == null || getDateDiffInSeconds(new Date(), sheetLastUpdate) > config.SHEET_CACHE_TTL_SECONDS) {
    await loadSheet(document.sheetsByIndex[0])
    bot.context.sheetLastUpdate = new Date()
  }
}

const botHandlerWrapper = async ({
  command,
  ctx,
  bot
}: BotHandlerWrapperOptions): Promise<void> => {
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

    if (command.requireDocument) {
      // update bot.context and copy new values to ctx
      await updateDocumentInContext(bot)
      Object.assign(ctx, bot.context)
    }

    await command.handler(ctx)

    const finishMs = Date.now() - startMs

    logger.info(`✅ Processed /${command.name} in ${finishMs}ms.`)
  } catch (e) {
    if (e instanceof UserError) {
      void ctx.reply(`❌ ${e.message}`)
    } else {
      handleCommandError(e as Error)
      void ctx.reply('❌ Произошла ошибка. Повторите свой запрос позже.')
    }
  }
}

export const setBotCommands = async (bot: Telegraf<BotContext>): Promise<void> => {
  commands.map((command) =>
    bot.command('/' + command.name, async (ctx) => await botHandlerWrapper({ command, ctx, bot }))
  )

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) =>
    await ctx.reply(
      'Не удалось распознать команду. Используйте меню или команду /help'
    )
  )
}
