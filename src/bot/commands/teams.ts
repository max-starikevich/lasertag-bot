import dedent from 'dedent-js'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game } = ctx

  await game.refreshData()

  const [team1, team2] = await game.createTeams()
  const placeAndTime = await game.getPlaceAndTime()

  return await ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      Команда 1 (${team1.length})
      ${team1
        .map((player) => `- ${player.name}`)
        .join('\n')}

      Команда 2 (${team2.length})
      ${team2
        .map((player) => `- ${player.name}`)
        .join('\n')}
    `
  )
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: 'Создать команды на базе файла записи',
  showInMenu: true,
  requireDocument: true
}
