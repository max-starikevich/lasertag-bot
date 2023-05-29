import { Command, CommandHandler } from '../types'
import { initializer as startRegister } from '../actions/register'

const handler: CommandHandler = async (ctx) => {
  return await startRegister(ctx)
}

export const register: Command = {
  name: 'register',
  handler,
  description: lang => lang.REGISTER_COMMAND_DESCRIPTION(),
  showInMenu: true
}
