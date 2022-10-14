import dedent from 'dedent-js'

import { commandsInMenu } from '$/bot'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  return await ctx.replyWithHTML(
    dedent`
      <b>Доступные команды</b>:

      ${commandsInMenu
        .map(
          ({ name, description }) =>
            `/${name} - ${description.toLowerCase()}`
        )
        .join('\n\n')}
      `
  )
}

export const start: Command = {
  name: 'start',
  handler,
  description: 'Начало работы с ботом',
  showInMenu: false,
  requireDocument: false
}

export const help: Command = {
  name: 'help',
  handler,
  description: 'Помощь',
  showInMenu: true,
  requireDocument: false
}
