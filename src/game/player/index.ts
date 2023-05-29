import { keyBy } from 'lodash'
import { Player, ClanPlayer } from './types'

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
