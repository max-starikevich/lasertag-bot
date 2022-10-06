import dedent from 'dedent-js'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game } = ctx

  await game.refreshData()

  const { all, ready, questionable } = await game.getPlayers()
  const placeAndTime = await game.getPlaceAndTime()

  return await ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      Всего записано: ${ready.length}
      Нужен прокат: ${all.reduce(
        (rentSum, { rentCount }) => rentSum + rentCount,
        0
      )}

      ${ready
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName }) => `- ${combinedName}`)
        .join('\n')}

      ${questionable
        .filter(({ isCompanion }) => !isCompanion)
        .map(({ combinedName }) => `- ${combinedName} ???`)
        .join('\n')}
        
      ${all
        .filter(
          ({ comment, isCompanion }) => comment.length > 0 && !isCompanion
        )
        .map(({ name, comment }) => `${name}: "<i>${comment}</i>"`)
        .join('\n')}
    `
  )
}

export const players: Command = {
  name: 'players',
  handler,
  description: 'Список игроков в файле записи',
  showInMenu: true,
  requireDocument: true
}
