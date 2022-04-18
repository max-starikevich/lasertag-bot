import dedent from 'dedent-js'

import { CommandHandler, commandsInMenu } from '$/commands'

const handler: CommandHandler = async (ctx) => {
  return await ctx.replyWithHTML(
    dedent`
      <b>Доступные команды</b>:

      ${commandsInMenu
        .map(
          ({ command, description }) =>
            `/${command} - ${description.toLowerCase()}`
        )
        .join('\n\n')}
      `
  )
}

export default handler
