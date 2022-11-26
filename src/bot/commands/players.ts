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

  const messageHeader = dedent`
    📅 <b>${placeAndTime}</b>

    Записано: ${readyPlayers.length}
    Прокат: ${players.reduce(
    (rentSum, { rentCount }) => rentSum + rentCount,
    0
  )}


  `

  const playersMessage = players.length > 0
    ? dedent`
      ${readyPlayers
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName }) => `✔️ ${combinedName}`)
        .join('\n')}


      `
    : ''

  const questionableMessage = questionablePlayers.length > 0
    ? dedent`
      ${questionablePlayers
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName }) => `❓ ${combinedName}`)
        .join('\n')}


      `
    : ''

  const commentsMessage = playersWithComments.length > 0
    ? dedent`
      ${playersWithComments
        .map(({ name, comment }) => `💬 ${name} «${comment.trim()}»`)
        .join('\n')}
      `
    : ''

  return await ctx.replyWithHTML(messageHeader + playersMessage + questionableMessage + commentsMessage)
}

export const players: Command = {
  name: 'players',
  handler,
  description: 'Список игроков в файле записи',
  showInMenu: true,
  requireDocument: true
}
