import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { isAdminPlayer } = ctx

  if (!isAdminPlayer) {
    return
  }

  throw new Error('Dummy error to test error reporting')
}

export const error: Command = {
  name: 'error',
  handler,
  description: () => 'ERROR_REPORT_TEST',
  showInMenu: false
}
