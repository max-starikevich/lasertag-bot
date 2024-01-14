import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { lang, getStorage, currentPlayer } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const storage = await getStorage()

  currentPlayer.telegramUserId = null

  await storage.savePlayer(currentPlayer.name, {
    telegramUserId: null
  })

  return await ctx.reply(`✅ ${lang.UNREGISTER_SUCCESS()}`)
}

export const unregister: Command = {
  name: 'unregister',
  handler,
  description: lang => lang.UNREGISTER_COMMAND_DESCRIPTION(),
  showInMenu: true
}
