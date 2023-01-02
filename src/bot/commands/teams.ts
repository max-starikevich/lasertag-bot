import dedent from 'dedent-js'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [redPlayers, bluePlayers] = await game.getTeams()

  const placeAndTime = await game.getPlaceAndTime()

  const teams = dedent`
    📅 <b>${placeAndTime}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵

    ${redPlayers
      .map((player) => `🔴 ${player.name}`)
      .join('\n')}

    ${bluePlayers
      .map((player) => `🔵 ${player.name}`)
      .join('\n')}

    Баланс: 🔴 ${redPlayers.reduce((result, { level }) => result + level, 0)} 🔵 ${bluePlayers.reduce((sum, player) => sum + player.level, 0)}
  `

  return await ctx.replyWithHTML(teams)
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: 'Поделить игроков на команды',
  showInMenu: true
}
