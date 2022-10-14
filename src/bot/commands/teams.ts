import dedent from 'dedent-js'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game } = ctx

  await game.refreshData()

  const [team1, team2] = await game.createTeams()

  if (team1.length === 0 || team2.length === 0) {
    return await ctx.replyWithHTML('🤷 Недостаточно игроков для этой функции')
  }

  const placeAndTime = await game.getPlaceAndTime()

  return await ctx.replyWithHTML(
    dedent`
      📅 <b>${placeAndTime}</b>

      ${team1
        .map((player) => `🔴 ${player.name}`)
        .join('\n')}

      ${team2
        .map((player) => `🔵 ${player.name}`)
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
