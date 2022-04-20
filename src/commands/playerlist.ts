import { partition } from 'lodash'
import dedent from 'dedent-js'

import { UserError } from '$/errors'
import { getActivePlayers, getPlaceAndTime } from '$/sheets'
import { BotCommand, BotCommandHandler } from '$/commands'

const handler: BotCommandHandler = async (ctx) => {
  const { document } = ctx

  if (document == null) {
    throw new Error('Не удалось прочитать таблицу')
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

const command: BotCommand = {
  name: 'playerlist',
  handler,
  description: 'Список записавшихся игроков в файл',
  showInMenu: true,
  requireDocument: true
}

export default command
