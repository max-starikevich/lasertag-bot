import { Telegraf } from 'telegraf'

import { BotContext } from '$/bot'
import { handleCommandError, UserError } from '$/errors'
import { logger } from '$/logger'

import help from '$/commands/help'
import playerlist from '$/commands/playerlist'
import randomTeams from '$/commands/randomteams'
import organizerdata from '$/commands/organizerdata'
import about from '$/commands/about'

export type CommandHandler = (ctx: BotContext) => Promise<any>

interface BotCommand {
  command: string
  handler: CommandHandler
  description: string
  showInMenu: boolean
}

const commands: BotCommand[] = [
  {
    command: '/start',
    handler: help,
    description: 'Начало работы с ботом',
    showInMenu: false
  },
  {
    command: '/playerlist',
    handler: playerlist,
    description: 'Список записавшихся игроков в файл',
    showInMenu: true
  },
  {
    command: '/organizerdata',
    handler: organizerdata,
    description: 'Данные для организаторов',
    showInMenu: true
  },
  {
    command: '/randomteams',
    handler: randomTeams,
    description: 'Сделать случайные составы команд по файлу записи',
    showInMenu: true
  },
  {
    command: '/help',
    handler: help,
    description: 'Помощь',
    showInMenu: true
  },
  {
    command: '/about',
    handler: about,
    description: 'Информация о боте',
    showInMenu: true
  }
]

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu
)

interface HandlerWrapperOptions {
  command: string
  handler: CommandHandler
  ctx: BotContext
}

const handlerWrapper = async ({
  command,
  handler,
  ctx
}: HandlerWrapperOptions): Promise<void> => {
  try {
    const startMs = Date.now()
    await handler(ctx)
    const finishMs = Date.now() - startMs

    logger.info(`✅ Processed ${command} in ${finishMs}ms.`)
  } catch (e) {
    if (e instanceof UserError) {
      void ctx.reply(`❌ ${e.message}`)
    } else {
      handleCommandError(e)
      void ctx.reply('❌ Произошла ошибка. Повторите свой запрос позже.')
    }
  }
}

export const setBotCommands = async (bot: Telegraf<BotContext>): Promise<void> => {
  commands.map(({ command, handler }) =>
    bot.command(command, async (ctx) => await handlerWrapper({ command, handler, ctx }))
  )

  bot.hears(/^\/[a-z0-9]+$/i, async (ctx) =>
    await ctx.reply(
      'Не удалось распознать команду. Используйте меню или команду /help'
    )
  )
}
