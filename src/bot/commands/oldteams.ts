import dedent from 'dedent-js'
import { shuffle } from 'lodash'

import { Command, CommandHandler } from '../types'

import { getTeamsLevels } from '$/game/player/balance/utils'

const handler: CommandHandler = async (ctx) => {
  const { game, lang, locale } = ctx

  const [[redPlayers, bluePlayers], placeAndTime] = await Promise.all([game.getTeams(), game.getPlaceAndTime(locale)])

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    return await ctx.reply(lang.NOT_ENOUGH_PLAYERS_ENROLLED())
  }

  await ctx.replyWithHTML(dedent`
    📍 <b>${placeAndTime.location}</b>
    📅 <b>${placeAndTime.date}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵
  `)

  if (redPlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${shuffle(redPlayers)
        .map(({ name, clanEmoji }) => `🔴 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (bluePlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${shuffle(bluePlayers)
        .map(({ name, clanEmoji }) => `🔵 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (ctx.isAdmin && ctx.isPrivateChat) {
    const [redLevel, blueLevel] = getTeamsLevels([redPlayers, bluePlayers])

    return await ctx.replyWithHTML(dedent`
      ⚖️ ${lang.TEAMS_BALANCE()}: 🔴 ${Math.trunc(redLevel)} 🔵 ${Math.trunc(blueLevel)}
    `)
  }
}

export const oldTeams: Command = {
  name: 'oldteams',
  handler,
  description: lang => lang.OLD_TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
