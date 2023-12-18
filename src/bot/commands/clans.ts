import dedent from 'dedent-js'
import { groupBy, orderBy } from 'lodash'

import { getClanPlayers, orderTeamByGameCount } from '$/game/player'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { players, lang } = ctx

  const clanPlayers = orderTeamByGameCount(getClanPlayers(players))

  const clans = orderBy(
    Object.entries(
      groupBy(clanPlayers, ({ clanName }) => clanName)
    ),
    ([, players]) => players.length, 'desc'
  )

  if (clans.length === 0) {
    return await ctx.replyWithHTML(`🤷 ${lang.CLANS_NO_PLAYERS()}`)
  }

  for (const [clanName, players] of clans) {
    await ctx.replyWithHTML(dedent`
      <b>${clanName}</b>

      ${players
        .map(player =>
          `${player.count > 0 && !player.isQuestionableCount ? '✔️' : '➖'} ${player.name}`
        ).join('\n')
      }
    `)
  }
}

export const clans: Command = {
  name: 'clans',
  handler,
  description: lang => lang.CLANS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
