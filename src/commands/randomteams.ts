import { partition, shuffle } from 'lodash'
import dedent from 'dedent-js'

import { UserError } from '$/errors'
import { getActivePlayers, getPlaceAndTime } from '$/sheets'
import { getBalancedTeams } from '$/player'
import { CommandHandler } from '$/commands'

const handler: CommandHandler = async (ctx) => {
  const { document } = ctx

  if (document == null) {
    throw new UserError('Не удалось прочитать таблицу')
  }

  const activePlayers = await getActivePlayers(document)

  if (activePlayers.length < 2) {
    throw new UserError('Записано меньше двух человек')
  }

  const placeAndTime = await getPlaceAndTime(document)

  const [playersToDivide] = partition(
    activePlayers,
    ({ isQuestionable, isCompanion }) => !isQuestionable && !isCompanion
  )

  const [team1, team2] = getBalancedTeams(playersToDivide)

  return await ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      Команда 1 (${team1.length})
      ${shuffle(team1)
        .map((player) => `- ${player.name}`)
        .join('\n')}

      Команда 2 (${team2.length})
      ${shuffle(team2)
        .map((player) => `- ${player.name}`)
        .join('\n')}
    `
  )
}

export default handler
