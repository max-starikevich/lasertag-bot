import dedent from 'dedent-js'
import { orderBy } from 'lodash'

import { getSquadsForTeam } from '$/game/player'
import { getTeamsLevels } from '$/game/player/balance'
import { Player, Teams } from '$/game/player/types'

import { Command, CommandContext } from '../types'

import { start, help } from './help'
import { players } from './players'
import { teams } from './teams'
import { clanteams } from './clanteams'
import { aiteams } from './aiteams'
import { clans } from './clans'
import { register } from './register'
import { language } from './language'
import { unregister } from './unregister'
import { about } from './about'
import { links } from './links'
import { enroll } from './enroll'
import { me } from './me'
import { error } from './error'

export const commands: Command[] = [
  start,
  enroll,
  me,
  players,
  aiteams,
  clanteams,
  teams,
  clans,
  links,
  register,
  language,
  unregister,
  about,
  help,
  error
]

export const replyWithPlaceAndTime = async (ctx: CommandContext): Promise<void> => {
  const { storage } = ctx

  const placeAndTimeData = await storage.getLocations()
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
  const { currentPlayer } = ctx

  if (currentPlayer === undefined || !currentPlayer.isAdmin || !ctx.isPrivateChat) {
    return
  }

  const { lang } = ctx
  const [redLevel, blueLevel] = getTeamsLevels(teams)

  await ctx.replyWithHTML(dedent`
    ⚖️ ${lang.TEAMS_BALANCE()}: 🔴 ${Math.trunc(redLevel)} 🔵 ${Math.trunc(blueLevel)}
  `)
}

export const replyWithPlayers = async (ctx: CommandContext, team: Player[], color: string): Promise<void> => {
  await ctx.replyWithHTML(dedent`
    ${team
      .map(({ name, clanEmoji }) => `${color} ${name} ${clanEmoji ?? ''}`)
      .join('\n')}
  `)
}

export const replyWithSquads = async (ctx: CommandContext, team: Player[], color: string): Promise<void> => {
  const { alone, ...clanSquadMap } = getSquadsForTeam(team)
  const clans = orderBy(Object.entries(clanSquadMap), ([, players]) => players.length, 'desc')

  await ctx.replyWithHTML(dedent`
    ${clans
      .map(([clanName, players]) =>
        `<b>${clanName}</b>\n` +
        players.map(({ name }) => `${color} ${name}`).join('\n')
      ).join('\n\n')}

    ${alone
      .map(({ name, clanEmoji }) => `${color} ${name} ${clanEmoji ?? ''}`)
      .join('\n')}
  `)
}
