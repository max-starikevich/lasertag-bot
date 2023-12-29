import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'

import { getActivePlayers, orderTeamByGameCount } from '$/game/player'
import { Player } from '$/game/player/types'
import { AiWrongResponse } from '$/errors/AiWrongResponse'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithPlayers, replyWithTeamCount } from '.'
import { initializer as replyWithStatsActions } from '../actions/stats'

const handler: CommandHandler = async (ctx) => {
  const { players, aiBalancer, lang } = ctx

  const activePlayers = getActivePlayers(players)

  if (activePlayers.length < 8) {
    throw new NotEnoughPlayersError()
  }

  await ctx.reply(`🤖 ${lang.AI_IN_PROGRESS()}`)

  const { team1, team2 } = await aiBalancer.balance(activePlayers.map(({ name }) => name))

  const [redPlayers, bluePlayers] = [team1, team2].map(({ players: arbitraryPlayers }) =>
    arbitraryPlayers.reduce<Player[]>((team, arbitraryPlayer) => {
      const player = activePlayers.find(({ name }) => name === arbitraryPlayer.Name)

      if (player == null) {
        return team
      }

      return [...team, player]
    }, [])
  ).map(team => orderTeamByGameCount(team))

  if (redPlayers.length + bluePlayers.length !== activePlayers.length) {
    throw new AiWrongResponse('AI balancing failed: team lengths mismatch')
  }

  await replyWithPlaceAndTime(ctx)

  await replyWithTeamCount(ctx, [redPlayers, bluePlayers])

  if (redPlayers.length > 0) {
    await replyWithPlayers(ctx, redPlayers, '🔴')
  }

  if (bluePlayers.length > 0) {
    await replyWithPlayers(ctx, bluePlayers, '🔵')
  }

  await replyWithStatsActions(ctx, [redPlayers, bluePlayers])
}

export const aiteams: Command = {
  name: 'aiteams',
  handler,
  description: lang => `${lang.AI_TEAMS_COMMAND_DESCRIPTION()} 🤖`,
  showInMenu: true
}
