import dedent from 'dedent-js'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game } = ctx

  await game.refreshData()

  const [redPlayers, bluePlayers] = await game.getTeams()

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    return await ctx.replyWithHTML('🤷 Недостаточно игроков для этой функции')
  }

  const placeAndTime = await game.getPlaceAndTime()

  return await ctx.replyWithHTML(
    dedent`
      📅 <b>${placeAndTime}</b>

      ${redPlayers
        .map((player) => `🔴 ${player.name}`)
        .join('\n')}

      ${bluePlayers
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
