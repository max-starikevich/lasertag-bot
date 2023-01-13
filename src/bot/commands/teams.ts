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
      groupBy(redPlayers, ({ clanName }) => clanName ?? '-')
    ),
    [
      ([clanName]) => clanName === '-' ? 0 : 1,
      ([, players]) => players.length
    ]
  )

  const blueGroups = orderBy(
    Object.entries(
      groupBy(bluePlayers, ({ clanName }) => clanName ?? '-')
    ),
    [
      ([clanName]) => clanName === '-' ? 0 : 1,
      ([, players]) => players.length
    ]
  )

  await ctx.replyWithHTML(dedent`
    📅 <b>${placeAndTime}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵
  `)

  await ctx.replyWithHTML(dedent`
    ${redGroups
      .map(([clanName, players]) =>
        (clanName !== '-' ? `<b>${clanName}</b>\n` : '') + shuffle(players).map(({ name }) => `🔴 ${name}`).join('\n')
      )
      .join('\n\n')}
  `)

  await ctx.replyWithHTML(dedent`
    ${blueGroups
      .map(([clanName, players]) =>
        (clanName !== '-' ? `<b>${clanName}</b>\n` : '') + shuffle(players).map(({ name }) => `🔵 ${name}`).join('\n')
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
