import dedent from 'dedent-js'

import { getTeamsLevels } from '$/game/player/balance'
import { Teams } from '$/game/player/types'

import { Command, CommandContext } from '../types'

import { start, help } from './help'
import { players } from './players'
import { oldTeams } from './oldteams'
import { teams } from './teams'
import { clans } from './clans'
import { register } from './register'
import { language } from './language'
import { unregister } from './unregister'
import { about } from './about'
import { links } from './links'
import { enroll } from './enroll'

export const commands: Command[] = [
  start,
  enroll,
  players,
  teams,
  oldTeams,
  clans,
  links,
  register,
  language,
  unregister,
  about,
  help
]

export const replyWithPlaceAndTime = async (ctx: CommandContext): Promise<void> => {
  const { game, logger } = ctx

  const placeAndTimeData = await game.getPlaceAndTime({ logger })
  const placeAndTime = placeAndTimeData.find(data => data.lang === ctx.locale)

  if (placeAndTime === undefined) {
    throw new Error(`Missing game data for locale ${ctx.locale}`)
  }

  await ctx.replyWithHTML(dedent`
    📅 <b>${placeAndTime.date}</b>
    📍 <b>${placeAndTime.location}</b>
  `)
}

export const replyWithTeamCount = async (ctx: CommandContext, [redPlayers, bluePlayers]: Teams): Promise<void> => {
  await ctx.replyWithHTML(dedent`
    🔴 ${redPlayers.length} vs. ${bluePlayers.length} 🔵
  `)
}

export const replyWithTeamBalance = async (ctx: CommandContext, teams: Teams): Promise<void> => {
  if (ctx.isAdmin && ctx.isPrivateChat) {
    const { lang } = ctx
    const [redLevel, blueLevel] = getTeamsLevels(teams)

    await ctx.replyWithHTML(dedent`
      ⚖️ ${lang.TEAMS_BALANCE()}: 🔴 ${Math.trunc(redLevel)} 🔵 ${Math.trunc(blueLevel)}
    `)
  }
}
