import { Command, CommandHandler } from '../types'
import { register as registerAction } from '../actions/register'

const handler: CommandHandler = async (ctx) => {
  return await registerAction.initializer(ctx)
}

export const register: Command = {
  name: 'register',
  handler,
  description: lang => lang.REGISTER_COMMAND_DESCRIPTION(),
  showInMenu: true
}
