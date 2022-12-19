import dedent from 'dedent-js'

import { Command, CommandHandler } from '../types'

import { MIN_PLAYERS_FOR_BALANCE_ADJUST } from '$/game/player/balance'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [redPlayers, bluePlayers] = await game.getTeams()

  if (redPlayers.length < MIN_PLAYERS_FOR_BALANCE_ADJUST || bluePlayers.length < MIN_PLAYERS_FOR_BALANCE_ADJUST) {
    return await ctx.replyWithHTML(`🤷 Недостаточно записано игроков для этой функции. Должно быть минимум ${MIN_PLAYERS_FOR_BALANCE_ADJUST}x${MIN_PLAYERS_FOR_BALANCE_ADJUST}`)
  }

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
  description: 'Создать команды на базе файла записи',
  showInMenu: true
}
