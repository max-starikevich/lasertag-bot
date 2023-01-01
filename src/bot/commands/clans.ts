import dedent from 'dedent-js'
import { groupBy, orderBy } from 'lodash'

import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [redPlayers, bluePlayers] = await game.getTeamsWithClans()

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
        `<b>${teamName}</b>\n` + players.map(({ name }) => `🔴 ${name}`).join('\n')
      )
      .join('\n\n')}

    ${blueGroups
      .map(([teamName, players]) =>
        `<b>${teamName}</b>\n` + players.map(({ name }) => `🔵 ${name}`).join('\n')
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
