import { keyBy } from 'lodash'
import { User } from 'telegraf/typings/core/types/typegram'

import L from '$/lang/i18n-node'
import { TranslationFunctions } from '$/lang/i18n-types'
import { defaultLocale } from '$/lang/i18n-custom'

import { Player, ClanPlayer, Role, AdminPlayer } from './types'

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

export const getPlayerLang = (player?: Player): TranslationFunctions => L[player?.locale ?? defaultLocale]
