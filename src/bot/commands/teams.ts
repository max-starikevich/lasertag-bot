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

  const teams = await balancers.noClans.balance(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByGameCount(team))

  await replyWithTeamList({
    ctx,
    teams: [redPlayers, bluePlayers],
    showBalance: true,
    showSquads: false
  })
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: lang => lang.TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
