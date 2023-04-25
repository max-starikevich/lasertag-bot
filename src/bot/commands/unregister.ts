import { pick } from 'lodash'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { lang, game, currentPlayer } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  currentPlayer.telegramUserId = null

  await game.savePlayer({
    ...pick(currentPlayer, ['tableRow', 'name']),
    telegramUserId: null
  })

  return await ctx.reply(lang.UNREGISTER_SUCCESS())
}

export const unregister: Command = {
  name: 'unregister',
  handler,
  description: lang => lang.UNREGISTER_COMMAND_DESCRIPTION(),
  showInMenu: true
}
