import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getActivePlayers, orderTeamByGameCount } from '$/game/player'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithPlayers, replyWithTeamCount } from '.'
import { initializer as replyWithStatsActions } from '../actions/stats'

const handler: CommandHandler = async (ctx) => {
  const { players, balancers, lang } = ctx

  const activePlayers = getActivePlayers(players)

  if (activePlayers.length < 8) {
    throw new NotEnoughPlayersError()
  }

  void ctx.reply(`⌛ ${lang.AI_TEAMS_IN_PROGRESS()}`)

  const teams = await balancers.chatGpt.balance(activePlayers)
  const [redPlayers, bluePlayers] = teams.map(team => orderTeamByGameCount(team))

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
