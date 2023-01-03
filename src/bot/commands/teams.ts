import dedent from 'dedent-js'
import { shuffle } from 'lodash'

import { MIN_TEAM_SIZE_FOR_BALANCING } from '../constants'
import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [redPlayers, bluePlayers, levelDifference] = await game.getTeams()

  if (redPlayers.length < MIN_TEAM_SIZE_FOR_BALANCING || bluePlayers.length < MIN_TEAM_SIZE_FOR_BALANCING) {
    return await ctx.replyWithHTML(`🤷 В записи недостаточно игроков для этой функции. Нужно минимум ${MIN_TEAM_SIZE_FOR_BALANCING}x${MIN_TEAM_SIZE_FOR_BALANCING}`)
  }

  const placeAndTime = await game.getPlaceAndTime()

  const teams = dedent`
    📅 <b>${placeAndTime}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵

    ${shuffle(redPlayers)
      .map((player) => `🔴 ${player.name}`)
      .join('\n')}

    ${shuffle(bluePlayers)
      .map((player) => `🔵 ${player.name}`)
      .join('\n')}
  `

  const balance = levelDifference > 1 || levelDifference < -1
    ? `\n\n ⚠️ Перевес в сторону ${levelDifference > 0 ? 'красных' : 'синих'}: ${Math.abs(levelDifference)}`
    : '\n\n 👌 Полный баланс'

  return await ctx.replyWithHTML(teams + balance)
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: 'Поделить игроков на команды',
  showInMenu: true
}
