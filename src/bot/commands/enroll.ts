import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { currentPlayer, lang } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  await ctx.replyWithHTML(lang.ENROLL_COMMAND_SUCCESS())
}

export const enroll: Command = {
  name: 'enroll',
  handler,
  description: lang => lang.ENROLL_COMMAND_DESCRIPTION(),
  showInMenu: true
}
