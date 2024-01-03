import dedent from 'dedent-js'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { currentPlayer, lang } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  await ctx.replyWithHTML(dedent`
    <b>${currentPlayer.name} ${currentPlayer.clanEmoji ?? ''}</b>

    ${lang.ME_GAME_COUNT()}: ${currentPlayer.gameCount}
    ${lang.ME_WINRATE()}: ${currentPlayer.winRate}%
    ${lang.ME_WINS()}: ${currentPlayer.wins}
    ${lang.ME_LOSSES()}: ${currentPlayer.losses}
    ${lang.ME_DRAWS()}: ${currentPlayer.draws}
  `)
}

export const me: Command = {
  name: 'me',
  handler,
  description: lang => lang.ME_COMMAND_DESCRIPTION(),
  showInMenu: true
}
