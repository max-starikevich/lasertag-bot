import dedent from 'dedent-js'
import { partition } from 'lodash'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime } from '.'

const handler: CommandHandler = async (ctx) => {
  await replyWithPlaceAndTime(ctx)

  const { game, lang, update } = ctx

  const players = await game.getPlayers(update.update_id)
  const enrolledPlayers = players.filter(({ count }) => count > 0)

  if (enrolledPlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  const [readyPlayers, questionablePlayers] = partition(
    enrolledPlayers,
    ({ isQuestionable }) => !isQuestionable
  )

  const playersWithComments = players.filter(
    ({ comment }) => comment !== undefined && comment.length > 0
  )

  await ctx.replyWithHTML(dedent`
    ${lang.RECORDED()}: ${readyPlayers.reduce((sum, { count }) => sum + count, 0)}
    ${lang.RENT()}: ${players.reduce(
      (sum, { rentCount }) => sum + rentCount,
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
        .map(({ name, comment }) => `💬 ${name}: «<i>${comment.trim()}</i>»`)
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
