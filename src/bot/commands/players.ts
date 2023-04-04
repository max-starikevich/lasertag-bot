import dedent from 'dedent-js'
import { partition } from 'lodash'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, lang, locale } = ctx

  const [allPlayers, placeAndTime] = await Promise.all([game.getPlayers(), game.getPlaceAndTime(locale)])
  const activePlayers = allPlayers.filter(({ count }) => count > 0)

  const [readyPlayers, questionablePlayers] = partition(
    activePlayers,
    ({ isQuestionable }) => !isQuestionable
  )

  const playersWithComments = allPlayers.filter(
    ({ comment }) => comment !== undefined && comment.length > 0
  )

  if (activePlayers.length === 0) {
    return await ctx.reply(lang.NOT_ENOUGH_PLAYERS())
  }

  await ctx.replyWithHTML(dedent`
    📍 <b>${placeAndTime.location}</b>
    📅 <b>${placeAndTime.date}</b>

    ${lang.RECORDED()}: ${readyPlayers.length}
    ${lang.RENT_NEEDED()}: ${allPlayers.reduce(
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
