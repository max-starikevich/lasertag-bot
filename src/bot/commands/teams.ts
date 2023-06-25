import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getBalancedTeamsWithClans } from '$/game/player/balance/with-clans'
import { getActivePlayers, orderTeamByPlayerList } from '$/game/player'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithSquads, replyWithTeamBalance, replyWithTeamCount } from '.'
import { initializer as replyWithStatsAction } from '../actions/stats'

const handler: CommandHandler = async (ctx) => {
  await replyWithPlaceAndTime(ctx)

  const { players } = ctx

  const activePlayers = getActivePlayers(players)
  const teams = getBalancedTeamsWithClans(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByPlayerList(team, activePlayers))

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  await replyWithTeamCount(ctx, [redPlayers, bluePlayers])

  if (redPlayers.length > 0) {
    await replyWithSquads(ctx, redPlayers, '🔴')
  }

  if (bluePlayers.length > 0) {
    await replyWithSquads(ctx, bluePlayers, '🔵')
  }

  await replyWithTeamBalance(ctx, [redPlayers, bluePlayers])
  await replyWithStatsAction(ctx, teams)
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: lang => lang.TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
