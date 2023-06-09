import { Command, CommandHandler } from '../types'
import { initializer as chooseLanguage } from '../actions/language'

const handler: CommandHandler = async (ctx) => {
  return await chooseLanguage(ctx)
}

export const language: Command = {
  name: 'language',
  handler,
  description: lang => lang.LANGUAGE_COMMAND_DESCRIPTION(),
  showInMenu: true
}
