import dedent from 'dedent-js'
import { groupBy, orderBy } from 'lodash'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [redPlayers, bluePlayers] = await game.getTeamsWithClans()

  const placeAndTime = await game.getPlaceAndTime()

  const redGroups = orderBy(Object.entries(groupBy(redPlayers, ({ isTeamMember, teamName }) => isTeamMember ? teamName : '-')), ([, players]) => players.length, 'asc')
  const blueGroups = orderBy(Object.entries(groupBy(bluePlayers, ({ isTeamMember, teamName }) => isTeamMember ? teamName : '-')), ([, players]) => players.length, 'asc')

  const teams = dedent`
    📅 <b>${placeAndTime}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵

    ${redGroups
      .map(([teamName, players]) =>
        (teamName === '-' ? '' : `<b>${teamName}</b>\n`) + players.map(({ name }) => `🔴 ${name}`).join('\n')
      )
      .join('\n\n')}

    ${blueGroups
      .map(([teamName, players]) =>
        (teamName === '-' ? '' : `<b>${teamName}</b>\n`) + players.map(({ name }) => `🔵 ${name}`).join('\n')
      )
      .join('\n\n')}

    Баланс: 🔴 ${redPlayers.reduce((result, { level }) => result + level, 0)} 🔵 ${bluePlayers.reduce((sum, player) => sum + player.level, 0)}
  `

  return await ctx.replyWithHTML(teams)
}

export const clans: Command = {
  name: 'clans',
  handler,
  description: 'Создать команды с кланами',
  showInMenu: true
}
