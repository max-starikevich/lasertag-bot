import { Telegraf } from 'telegraf'

import { getLogData, BotContext } from '$/bot/context'
import { handlerWrapper } from '$/bot/middleware'

import help, { start } from '$/bot/commands/help'
import playerlist from '$/bot/commands/playerlist'
import randomTeams from '$/bot/commands/randomteams'
import organizerdata from '$/bot/commands/organizerdata'
import about from '$/bot/commands/about'

import { logger } from '$/logger'
import { ActionKind } from '$/logger/ActionKind'

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
      ...userData, kind: ActionKind.UNKNOWN_COMMAND
    })
  })
}
