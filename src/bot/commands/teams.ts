import dedent from 'dedent-js'
import { groupBy, orderBy, shuffle } from 'lodash'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { getBalancedTeamsWithClans } from '$/game/player/balance/with-clans'
import { getActivePlayers } from '$/game/player'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithTeamBalance, replyWithTeamCount } from '.'
import { initializer as startScore } from '../actions/score'

const handler: CommandHandler = async (ctx) => {
  await replyWithPlaceAndTime(ctx)

  const { players } = ctx

  const activePlayers = getActivePlayers(players)
  const teams = getBalancedTeamsWithClans(activePlayers)
  const [redPlayers, bluePlayers] = teams

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  await replyWithTeamCount(ctx, [redPlayers, bluePlayers])

  const redGroups = orderBy(
    Object.entries(
      groupBy(redPlayers, ({ clanName }) => clanName ?? '-')
    ),
    [
      ([clanName]) => clanName === '-' ? 0 : 1,
      ([, players]) => players.length
    ]
  )

  const blueGroups = orderBy(
    Object.entries(
      groupBy(bluePlayers, ({ clanName }) => clanName ?? '-')
    ),
    [
      ([clanName]) => clanName === '-' ? 0 : 1,
      ([, players]) => players.length
    ]
  )

  if (redGroups.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${redGroups
        .map(([clanName, players]) =>
          (clanName !== '-' ? `<b>${clanName}</b>\n` : '') + shuffle(players).map(({ name }) => `🔴 ${name}`).join('\n')
        )
        .join('\n\n')}
    `)
  }

  if (blueGroups.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${blueGroups
        .map(([clanName, players]) =>
          (clanName !== '-' ? `<b>${clanName}</b>\n` : '') + shuffle(players).map(({ name }) => `🔵 ${name}`).join('\n')
        )
        .join('\n\n')}
    `)
  }

  await replyWithTeamBalance(ctx, [redPlayers, bluePlayers])

  await startScore(ctx, teams)
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: lang => lang.TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
