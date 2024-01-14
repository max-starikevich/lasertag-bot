import { getActivePlayers, orderTeamByGameCount } from '$/features/players/utils'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'

import { Command, CommandHandler } from '../types'
import { replyWithTeamList } from '.'

const handler: CommandHandler = async (ctx) => {
  const { players, getClansBalancer } = ctx

  const clansBalancer = await getClansBalancer()

  const activePlayers = getActivePlayers(players)

  if (activePlayers.length < 8) {
    throw new NotEnoughPlayersError()
  }

  const teams = await clansBalancer.balance(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByGameCount(team))

  await replyWithTeamList({
    ctx,
    teams: [redPlayers, bluePlayers],
    showBalance: true,
    showSquads: true
  })
}

export const clanteams: Command = {
  name: 'clanteams',
  handler,
  description: lang => lang.CLAN_TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
