import dedent from 'dedent-js'
import { groupBy, orderBy, shuffle } from 'lodash'

import { Command, CommandHandler } from '../types'

import { getTeamsLevels } from '$/game/player/balance/utils'

const handler: CommandHandler = async (ctx) => {
  const { game, lang, locale } = ctx

  const [[redPlayers, bluePlayers], placeAndTime] = await Promise.all([game.getTeamsWithClans(), game.getPlaceAndTime(locale)])

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    return await ctx.reply(lang.NOT_ENOUGH_PLAYERS_ENROLLED())
  }

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
    📅 <b>${placeAndTime.date}</b>
    📍 <b>${placeAndTime.location}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵
  `)

  if (redGroups.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${redGroups
        .map(([clanName, players]) =>
          (clanName !== '-' ? `<b>${clanName}</b>\n` : '') + shuffle(players).map(({ name }) => `🔴 ${name}`).join('\n')
        )
        .join('\n\n')}
    `)
  }

  if (blueGroups.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${blueGroups
        .map(([clanName, players]) =>
          (clanName !== '-' ? `<b>${clanName}</b>\n` : '') + shuffle(players).map(({ name }) => `🔵 ${name}`).join('\n')
        )
        .join('\n\n')}
    `)
  }

  if (ctx.isAdmin && ctx.isPrivateChat) {
    const [redLevel, blueLevel] = getTeamsLevels([redPlayers, bluePlayers])

    return await ctx.replyWithHTML(dedent`
      ⚖️ ${lang.TEAMS_BALANCE()}: 🔴 ${Math.trunc(redLevel)} 🔵 ${Math.trunc(blueLevel)}
    `)
  }
}

export const teams: Command = {
  name: 'teams',
  handler,
  description: lang => lang.TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
