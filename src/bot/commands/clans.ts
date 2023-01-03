import dedent from 'dedent-js'
import { groupBy, orderBy, shuffle } from 'lodash'

import { MIN_TEAM_SIZE_FOR_BALANCING } from '../constants'
import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [redPlayers, bluePlayers, levelDifference] = await game.getTeamsWithClans()

  if (redPlayers.length < MIN_TEAM_SIZE_FOR_BALANCING || bluePlayers.length < MIN_TEAM_SIZE_FOR_BALANCING) {
    return await ctx.replyWithHTML(`🤷 В записи недостаточно игроков для этой функции. Нужно минимум ${MIN_TEAM_SIZE_FOR_BALANCING}x${MIN_TEAM_SIZE_FOR_BALANCING}`)
  }

  const placeAndTime = await game.getPlaceAndTime()

  const redGroups = orderBy(
    Object.entries(
      groupBy(redPlayers, ({ teamName, isAloneInTeam }) => isAloneInTeam ? 'Красные' : teamName)
    ),
    ([, players]) => players.length, 'desc'
  )

  const blueGroups = orderBy(
    Object.entries(
      groupBy(bluePlayers, ({ teamName, isAloneInTeam }) => isAloneInTeam ? 'Синие' : teamName)
    ),
    ([, players]) => players.length, 'desc'
  )

  const teams = dedent`
    📅 <b>${placeAndTime}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵

    ${redGroups
      .map(([teamName, players]) =>
        `<b>${teamName}</b>\n` + shuffle(players).map(({ name }) => `🔴 ${name}`).join('\n')
      )
      .join('\n\n')}

    ${blueGroups
      .map(([teamName, players]) =>
        `<b>${teamName}</b>\n` + shuffle(players).map(({ name }) => `🔵 ${name}`).join('\n')
      )
      .join('\n\n')}
  `

  const balance = levelDifference > 1 || levelDifference < -1
    ? `\n\n⚠️ Перевес в сторону ${levelDifference > 0 ? 'красных' : 'синих'}: ${Math.abs(levelDifference)}`
    : '\n\n👌 Полный баланс'

  return await ctx.replyWithHTML(teams + balance)
}

export const clans: Command = {
  name: 'clans',
  handler,
  description: 'Поделить игроков на команды с кланами',
  showInMenu: true
}
