import dedent from 'dedent-js'
import { partition } from 'lodash'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })
  const [players, placeAndTime] = await Promise.all([game.getPlayers(), game.getPlaceAndTime()])
  const activePlayers = players.filter(({ count }) => count > 0)

  const [readyPlayers, questionablePlayers] = partition(
    activePlayers,
    ({ isQuestionable }) => !isQuestionable
  )

  const playersWithComments = players.filter(
    ({ comment }) => comment.length > 0
  )

  await ctx.replyWithHTML(dedent`
    📅 <b>${placeAndTime}</b>

    Записано: ${readyPlayers.length}
    Прокат: ${players.reduce(
      (rentSum, { rentCount }) => rentSum + rentCount,
    0)}
  `)

  if (players.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${readyPlayers
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName, teamEmoji }) => `✔️ ${combinedName} ${teamEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (questionablePlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${questionablePlayers
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName, teamEmoji }) => `❓ ${combinedName} ${teamEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (playersWithComments.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${playersWithComments
        .map(({ name, comment }) => `💬 ${name}: «<i>${comment.trim()}</i>»`)
        .join('\n')}
    `)
  }
}

export const players: Command = {
  name: 'players',
  handler,
  description: 'Список игроков',
  showInMenu: true
}
