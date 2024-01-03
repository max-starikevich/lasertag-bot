import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getActivePlayers, orderTeamByGameCount } from '$/game/player'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithSquads, replyWithTeamBalance, replyWithTeamCount } from '.'
import { initializer as replyWithStatsActions } from '../actions/stats'

const handler: CommandHandler = async (ctx) => {
  const { players, balancers } = ctx

  const activePlayers = getActivePlayers(players)

  const teams = await balancers.withClans.balance(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByGameCount(team))

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  await replyWithPlaceAndTime(ctx)

  await replyWithTeamCount(ctx, [redPlayers, bluePlayers])

  if (redPlayers.length > 0) {
    await replyWithSquads(ctx, redPlayers, '🔴')
  }

  if (bluePlayers.length > 0) {
    await replyWithSquads(ctx, bluePlayers, '🔵')
  }

  await replyWithTeamBalance(ctx, [redPlayers, bluePlayers])

  await replyWithStatsActions(ctx, teams)
}

export const clanteams: Command = {
  name: 'clanteams',
  handler,
  description: lang => lang.CLAN_TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
