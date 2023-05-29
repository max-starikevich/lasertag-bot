import { Command, CommandHandler } from '../types'
import { initializer as startEnroll } from '../actions/enroll'

const handler: CommandHandler = async (ctx) => {
  return await startEnroll(ctx)
}

export const enroll: Command = {
  name: 'enroll',
  handler,
  description: lang => lang.ENROLL_COMMAND_DESCRIPTION(),
  showInMenu: true
}
