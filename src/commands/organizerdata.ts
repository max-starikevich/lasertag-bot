import { partition } from 'lodash'
import dedent from 'dedent-js'

import { UserError, ServiceError, ServiceErrorCodes, UserErrorCodes } from '$/errors'
import { getActivePlayers, getPlaceAndTime } from '$/sheets'
import { BotCommand, BotCommandHandler } from '$/commands'

const handler: BotCommandHandler = async (ctx) => {
  const { document } = ctx

  if (document == null) {
    throw new ServiceError('Не удалось прочитать таблицу', ServiceErrorCodes.NO_DOCUMENT_LOADED)
  }

  const activePlayers = await getActivePlayers(document)

  if (activePlayers.length === 0) {
    throw new UserError('Никто не записан', UserErrorCodes.EMPTY_LIST)
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
      Под вопросом: ${questionablePlayers.length}
      Нужен прокат: ${activePlayers.reduce(
        (rentSum, { rentCount }) => rentSum + rentCount,
        0
      )}

      ${activePlayers
        .filter(
          ({ comment, isCompanion }) => comment.length > 0 && !isCompanion
        )
        .map(({ name, comment }) => `${name}: "<i>${comment}</i>"`)
        .join('\n')}
    `
  )
}

const command: BotCommand = {
  name: 'organizerdata',
  handler,
  description: 'Данные для организаторов',
  showInMenu: true,
  requireDocument: true
}

export default command
