import dedent from 'dedent-js'
import { shuffle } from 'lodash'

import { Command, CommandHandler } from '../types'

import { getTeamsLevels } from '$/game/player/balance/utils'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  await game.refreshData({ logger })

  const [[redPlayers, bluePlayers], placeAndTime] = await Promise.all([game.getTeams(), game.getPlaceAndTime()])

  await ctx.replyWithHTML(dedent`
    📅 <b>${placeAndTime}</b>

    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵
  `)

  await ctx.replyWithHTML(dedent`
    ${shuffle(redPlayers)
      .map(({ name, teamEmoji }) => `🔴 ${name} ${teamEmoji ?? ''}`)
      .join('\n')}
  `)

  await ctx.replyWithHTML(dedent`
    ${shuffle(bluePlayers)
      .map(({ name, teamEmoji }) => `🔵 ${name} ${teamEmoji ?? ''}`)
      .join('\n')}
  `)

  if (ctx.isAdmin && ctx.isPrivateChat) {
    const [redLevel, blueLevel] = getTeamsLevels([redPlayers, bluePlayers])

    return await ctx.replyWithHTML(dedent`
      ⚖️ Баланс: 🔴 ${redLevel} 🔵 ${blueLevel}
    `)
  }
}

export const oldTeams: Command = {
  name: 'oldteams',
  handler,
  description: 'Поделить игроков на команды без кланов',
  showInMenu: true
}
