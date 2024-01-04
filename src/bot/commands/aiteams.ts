import { getActivePlayers, orderTeamByGameCount } from '$/game/player'
import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { AccessDeniedError } from '$/errors/AccessDeniedError'

import { Command, CommandHandler } from '../types'
import { replyWithTeamList } from '.'

const handler: CommandHandler = async (ctx) => {
  const { isAdmin, players, balancers, lang } = ctx

  if (!isAdmin) {
    throw new AccessDeniedError()
  }

  const activePlayers = getActivePlayers(players)

  if (activePlayers.length < 8) {
    throw new NotEnoughPlayersError()
  }

  void ctx.reply(`⌛ ${lang.AI_TEAMS_IN_PROGRESS()}`)

  const teams = await balancers.chatGpt.balance(activePlayers)
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
