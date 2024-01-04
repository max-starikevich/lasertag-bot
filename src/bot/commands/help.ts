import dedent from 'dedent-js'

import { commandsInMenu } from '$/bot/bot'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  return await ctx.replyWithHTML(
    dedent`
      <b>${ctx.lang.HELP_TITLE()}</b>:

      ${commandsInMenu
        .map(
          ({ name, description }) =>
            `/${name} - ${description(ctx.lang)}`
        )
        .join('\n\n')}
      `
  )
}

export const start: Command = {
  name: 'start',
  handler,
  description: lang => lang.HELP_COMMAND_DESCRIPTION(),
  showInMenu: false
}

export const help: Command = {
  name: 'help',
  handler,
  description: lang => lang.HELP_COMMAND_DESCRIPTION(),
  showInMenu: true
}
