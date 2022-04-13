import { partition } from 'lodash'
import dedent from 'dedent-js'

import { UserError } from '$/errors'
import { getActivePlayers, getPlaceAndTime } from '$/sheets'
import { CommandHandler } from '$/commands'

const handler: CommandHandler = async (ctx) => {
  const { document } = ctx

  if (document == null) {
    throw new UserError('Не удалось прочитать таблицу')
  }

  const activePlayers = await getActivePlayers(document)

  if (activePlayers.length === 0) {
    throw new UserError('Никто не записан')
  }

  const placeAndTime = await getPlaceAndTime(document)

  const [readyPlayers, questionablePlayers] = partition(
    activePlayers,
    ({ isQuestionable }) => !isQuestionable
  )

  return await ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      Всего записано: ${readyPlayers.length}

      ${readyPlayers
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName }) => `- ${combinedName}`)
        .join('\n')}

      ${questionablePlayers
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName }) => `- ${combinedName} ???`)
        .join('\n')}
    `
  )
}

export default handler
