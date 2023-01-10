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

    ${shuffle(redPlayers)
      .map((player) => `🔴 ${player.name}`)
      .join('\n')}

    ${shuffle(bluePlayers)
      .map((player) => `🔵 ${player.name}`)
      .join('\n')}
  `)

  if (ctx.isAdmin && ctx.isPrivateChat) {
    const [redLevel, blueLevel] = getTeamsLevels([redPlayers, bluePlayers])

    return await ctx.replyWithHTML(dedent`
      ⚖️ Баланс: 🔴 ${redLevel} 🔵 ${blueLevel}
    `)
  }
}

export const teamsOld: Command = {
  name: 'teamsOld',
  handler,
  description: 'Поделить игроков на команды (устаревшее)',
  showInMenu: false
}
