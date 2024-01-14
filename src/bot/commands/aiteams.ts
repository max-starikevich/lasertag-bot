import { getActivePlayers, orderTeamByGameCount } from '$/features/players/utils'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { AccessDeniedError } from '$/errors/AccessDeniedError'

import { Command, CommandHandler } from '../types'
import { replyWithTeamList } from '.'

const handler: CommandHandler = async (ctx) => {
  const { isAdminPlayer, players, getChatGptBalancer } = ctx

  if (!isAdminPlayer) {
    throw new AccessDeniedError()
  }

  const chatGptBalancer = await getChatGptBalancer()
  const activePlayers = getActivePlayers(players)

  if (activePlayers.length < 8) {
    throw new NotEnoughPlayersError()
  }

  const teams = await chatGptBalancer.balance(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByGameCount(team))

  await replyWithTeamList({
    ctx, teams: [redPlayers, bluePlayers]
  })
}

export const aiteams: Command = {
  name: 'aiteams',
  handler,
  description: lang => `${lang.AI_TEAMS_COMMAND_DESCRIPTION()} 🤖`,
  showInMenu: true
}
