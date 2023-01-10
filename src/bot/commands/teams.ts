import dedent from 'dedent-js'
import { groupBy, orderBy, shuffle } from 'lodash'

import { Command, CommandHandler } from '../types'

import { getTeamsLevels } from '$/game/player/balance/utils'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [[redPlayers, bluePlayers], placeAndTime] = await Promise.all([game.getTeamsWithClans(), game.getPlaceAndTime()])

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

  await ctx.replyWithHTML(dedent`
    📅 <b>${placeAndTime}</b>
  `)

  await ctx.replyWithHTML(dedent`
    ${redGroups
      .map(([teamName, players]) =>
        `<b>${teamName}</b>\n` + shuffle(players).map(({ name, teamEmoji }) => `🔴 ${name} ${teamEmoji ?? ''}`).join('\n')
      )
      .join('\n\n')}
  `)

  await ctx.replyWithHTML(dedent`
    ${blueGroups
      .map(([teamName, players]) =>
        `<b>${teamName}</b>\n` + shuffle(players).map(({ name, teamEmoji }) => `🔵 ${name} ${teamEmoji ?? ''}`).join('\n')
      )
      .join('\n\n')}
  `)

  if (ctx.isAdmin && ctx.isPrivateChat) {
    const [redLevel, blueLevel] = getTeamsLevels([redPlayers, bluePlayers])

    return await ctx.replyWithHTML(dedent`
      ⚖️ Баланс: 🔴 ${redLevel} 🔵 ${blueLevel}
    `)
  }
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: 'Поделить игроков на команды с кланами',
  showInMenu: true
}
