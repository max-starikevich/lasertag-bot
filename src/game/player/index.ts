import { groupBy, isEqual, keyBy, orderBy } from 'lodash'
import { User } from 'telegraf/typings/core/types/typegram'

import config from '$/config'
import L from '$/lang/i18n-node'
import { TranslationFunctions } from '$/lang/i18n-types'

import { Player, ClanPlayer, Role, AdminPlayer } from './types'
import { stringToSha1 } from '../../utils'

export const getActivePlayers = (players: Player[]): Player[] => {
  return players.filter(({ count, level, isQuestionableCount }) => count > 0 && level > 0 && !isQuestionableCount)
}

export const getClanPlayers = (players: Player[]): ClanPlayer[] => {
  return players.filter((player): player is ClanPlayer => player.clanName !== undefined)
}

export const getPlayerNames = (players: Player[]): string[] => {
  return players.map(player => player.name)
}

export const getPlayersByNames = (players: Player[], names: string[]): Player[] => {
  const map = keyBy(players, player => player.name)
  return names.map(name => map[name]).filter(player => player !== undefined)
}

export const extractRole = (s?: string): Role | undefined => {
  return Object.values(Role).find(v => v === s)
}

export const getAdmins = (players: Player[]): AdminPlayer[] =>
  players.filter((player): player is AdminPlayer =>
    player.telegramUserId != null && player.role === Role.ADMIN
  )

export const getFormattedTelegramUserName = ({ first_name: firstName, last_name: lastName, username: userName }: User): string =>
  [
    firstName,
    lastName,
    userName !== undefined ? `@${userName}` : undefined
  ]
    .filter(s => s !== undefined && s.length > 0)
    .join(' ')

export const getPlayerLang = (player?: Player): TranslationFunctions => L[player?.locale ?? config.DEFAULT_LOCALE]

interface Squads {
  alone: Player[]
  [clanName: string]: Player[]
}

export const getSquadsForTeam = (team: Player[]): Squads => {
  const clans = groupBy(team, p => p.clanName)

  return team.reduce<Squads>((squads, p) => {
    if (p.clanName == null) {
      squads.alone.push(p)
      return squads
    }

    const { clanName } = p

    if (clans[clanName] == null || clans[clanName].length < 2) {
      squads.alone.push(p)
      return squads
    }

    if (squads[clanName] === undefined) {
      squads[clanName] = []
    }

    squads[clanName].push(p)

    return squads
  }, { alone: [] })
}

export const orderTeamByPlayerList = <P extends Player>(team: P[], playerList: P[]): P[] =>
  orderBy(
    team, p =>
      playerList.map(({ name }) => name).indexOf(p.name)
  )

export const orderTeamByGameCount = <P extends Player>(team: P[]): P[] =>
  orderBy(
    team, p => p.gameCount, 'desc'
  )

export const areTwoTeamsTheSame = (team1: Player[], team2: Player[]): boolean => {
  if (team1.length !== team2.length) return false

  for (const item1 of team1) {
    if (!team2.some(item2 => isEqual(item1, item2))) return false
  }

  return true
}

export const generateTeamId = (team: Player[]): string => {
  const namesCombined = orderBy(
    team, p => p.name, 'asc'
  ).map(({ name }) => name).join(',')

  return stringToSha1(namesCombined)
}
