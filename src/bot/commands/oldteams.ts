import dedent from 'dedent-js'
import { shuffle } from 'lodash'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getBalancedTeams } from '$/game/player/balance/no-clans'
import { getActivePlayers } from '$/game/player'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithTeamBalance, replyWithTeamCount } from '.'
import { score as scoreAction } from '../actions/score'

const handler: CommandHandler = async (ctx) => {
  await replyWithPlaceAndTime(ctx)

  const { players } = ctx

  const activePlayers = getActivePlayers(players)
  const [redPlayers, bluePlayers] = getBalancedTeams(activePlayers)

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  await replyWithTeamCount(ctx, [redPlayers, bluePlayers])

  if (redPlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${shuffle(redPlayers)
        .map(({ name, clanEmoji }) => `🔴 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (bluePlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${shuffle(bluePlayers)
        .map(({ name, clanEmoji }) => `🔵 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  await replyWithTeamBalance(ctx, [redPlayers, bluePlayers])

  await scoreAction.initializer(ctx)
}

export const oldTeams: Command = {
  name: 'oldteams',
  handler,
  description: lang => lang.OLD_TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
