import dedent from 'dedent-js'
import { partition } from 'lodash'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })
  const [allPlayers, placeAndTime] = await Promise.all([game.getPlayers(), game.getPlaceAndTime()])
  const activePlayers = allPlayers.filter(({ count }) => count > 0)

  const [readyPlayers, questionablePlayers] = partition(
    activePlayers,
    ({ isQuestionable }) => !isQuestionable
  )

  const playersWithComments = allPlayers.filter(
    ({ comment }) => comment.length > 0
  )

  await ctx.replyWithHTML(dedent`
    📅 <b>${placeAndTime}</b>

    ${ctx.lang.RECORDED()}: ${readyPlayers.length}
    ${ctx.lang.RENT_NEEDED()}: ${allPlayers.reduce(
        (rentSum, { rentCount }) => rentSum + rentCount,
      0)}
  `)

  if (readyPlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${readyPlayers
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName, clanEmoji }) => `✔️ ${combinedName} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (questionablePlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${questionablePlayers
        .filter(({ isCompanion }) => !isCompanion)
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
