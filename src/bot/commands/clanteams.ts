import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getActivePlayers, orderTeamByGameCount } from '$/game/player'

import { Command, CommandHandler } from '../types'
import { replyWithTeamList } from '.'

const handler: CommandHandler = async (ctx) => {
  const { players, balancers } = ctx

  const activePlayers = getActivePlayers(players)

  if (activePlayers.length < 8) {
    throw new NotEnoughPlayersError()
  }

  const teams = await balancers.withClans.balance(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByGameCount(team))

  await replyWithTeamList(ctx, [redPlayers, bluePlayers])
}

export const clanteams: Command = {
  name: 'clanteams',
  handler,
  description: lang => lang.CLAN_TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
