import { Command, CommandHandler } from '../types'
import { enroll as enrollAction } from '../actions/enroll'

const handler: CommandHandler = async (ctx) => {
  return await enrollAction.initializer(ctx)
}

export const enroll: Command = {
  name: 'enroll',
  handler,
  description: lang => lang.ENROLL_COMMAND_DESCRIPTION(),
  showInMenu: true
}
