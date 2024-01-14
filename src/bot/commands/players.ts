import dedent from 'dedent-js'
import { partition } from 'lodash'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'
import { Player } from '$/features/players/types'

import { orderTeamByGameCount } from '$/features/players/utils'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime } from '.'

const handler: CommandHandler = async (ctx) => {
  const { players, lang } = ctx

  const playersSorted = orderTeamByGameCount(players)
  const enrolledPlayers = playersSorted.filter(({ count }) => count > 0)

  if (enrolledPlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  const [readyPlayers, questionablePlayers] = partition(
    enrolledPlayers,
    ({ isQuestionableCount }) => !isQuestionableCount
  )

  const playersWithComments = playersSorted.filter(
    (player): player is Player & { comment: string } => player.comment !== undefined
  )

  await replyWithPlaceAndTime(ctx)

  await ctx.replyWithHTML(dedent`
    ${lang.RECORDED()}: ${playersSorted.reduce(
      (sum, { count, isQuestionableCount }) => isQuestionableCount ? sum : sum + count,
    0)}
    ${lang.RENT()}: ${playersSorted.reduce(
      (sum, { rentCount, isQuestionableRentCount }) => isQuestionableRentCount ? sum : sum + rentCount,
    0)}
  `)

  if (readyPlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${readyPlayers
        .map(({ combinedName, clanEmoji }) => `✔️ ${combinedName} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (questionablePlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${questionablePlayers
        .map(({ combinedName, clanEmoji }) => `❓ ${combinedName} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (playersWithComments.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${playersWithComments
        .map(({ name, comment }) => `💬 ${name}: «<i>${comment}</i>»`)
        .join('\n\n')}
    `)
  }
}

export const players: Command = {
  name: 'players',
  handler,
  description: lang => lang.PLAYERS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
