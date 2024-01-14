import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getActivePlayers, orderTeamByGameCount } from '$/features/players/utils'

import { Command, CommandHandler } from '../types'
import { replyWithTeamList } from '.'

const handler: CommandHandler = async (ctx) => {
  const { players, getNoClansBalancer } = ctx

  const noClansBalancer = await getNoClansBalancer()
  const activePlayers = getActivePlayers(players)

  if (activePlayers.length < 4) {
    throw new NotEnoughPlayersError()
  }

  const teams = await noClansBalancer.balance(activePlayers)
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
