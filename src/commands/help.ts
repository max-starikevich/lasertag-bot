import dedent from 'dedent-js'

import { BotCommand, BotCommandHandler, commandsInMenu } from '$/commands'

const handler: BotCommandHandler = async (ctx) => {
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

const command: BotCommand = {
  name: 'help',
  handler,
  description: 'Помощь',
  showInMenu: true,
  requireDocument: false
}

const start: BotCommand = {
  name: 'start',
  handler,
  description: 'Начало работы с ботом',
  showInMenu: false,
  requireDocument: false
}

export default command
export { start }
