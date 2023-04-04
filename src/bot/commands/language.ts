import { Command, CommandHandler } from '../types'
import { language as languageAction } from '../actions/language'

const handler: CommandHandler = async (ctx) => {
  return await languageAction.initializer(ctx)
}

export const language: Command = {
  name: 'language',
  handler,
  description: lang => lang.LANGUAGE_COMMAND_DESCRIPTION(),
  showInMenu: true
}
