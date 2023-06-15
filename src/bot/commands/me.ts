import dedent from 'dedent-js'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { currentPlayer: player, lang } = ctx

  if (player === undefined) {
    throw new RegisterRequiredError()
  }

  await ctx.replyWithHTML(dedent`
    <b>${player.name} ${player.clanEmoji ?? ''}</b>

    ${lang.ME_GAME_COUNT()}: ${player.gameCount}
    ${lang.ME_WINRATE()}: ${player.winRate}%
    ${lang.ME_WINS()}: ${player.wins}
    ${lang.ME_LOSSES()}: ${player.losses}
    ${lang.ME_DRAWS()}: ${player.draws}
  `)
}

export const me: Command = {
  name: 'me',
  handler,
  description: lang => lang.ME_COMMAND_DESCRIPTION(),
  showInMenu: true
}
