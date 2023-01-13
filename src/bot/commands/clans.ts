import dedent from 'dedent-js'
import { groupBy, orderBy } from 'lodash'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const clanPlayers = await game.getClanPlayers()

  const clans = orderBy(
    Object.entries(
      groupBy(clanPlayers, ({ clanName }) => clanName)
    ),
    ([, players]) => players.length, 'desc'
  )

  for (const [clanName, players] of clans) {
    await ctx.replyWithHTML(dedent`
      <b>${clanName}</b>

      ${players
        .map(player =>
          `${player.count > 0 ? '✔️' : '➖'} ${player.name}`
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
