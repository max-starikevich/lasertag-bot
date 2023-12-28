import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getBalancedTeams } from '$/game/player/balance/no-clans'
import { getActivePlayers, orderTeamByGameCount } from '$/game/player'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithPlayers, replyWithTeamCount } from '.'
import { initializer as replyWithStatsActions } from '../actions/stats'

const handler: CommandHandler = async (ctx) => {
  const { players } = ctx

  const activePlayers = getActivePlayers(players)
  const teams = getBalancedTeams(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByGameCount(team))

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  await replyWithPlaceAndTime(ctx)

  await replyWithTeamCount(ctx, [redPlayers, bluePlayers])

  if (redPlayers.length > 0) {
    await replyWithPlayers(ctx, redPlayers, '🔴')
  }

  if (bluePlayers.length > 0) {
    await replyWithPlayers(ctx, bluePlayers, '🔵')
  }

  await replyWithStatsActions(ctx, teams)
}

export const aiteams: Command = {
  name: 'aiteams',
  handler,
  description: lang => `${lang.AI_TEAMS_COMMAND_DESCRIPTION()} 🤖`,
  showInMenu: true
}
