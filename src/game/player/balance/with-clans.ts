import { orderBy, groupBy, partition } from 'lodash'

import { Player, Teams } from '../types'
import { getAverageTeamLevel, getTeamsLevels } from './utils'
import { balanceTeamsNTimes } from '.'

export const getBalancedTeamsWithClans = (players: Player[]): Teams => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')
  const [clanPlayers, noClanPlayers] = partition(ratedPlayers, ({ isClanMember }) => isClanMember)

  const clans = orderBy(Object.entries(groupBy(clanPlayers, ({ clanName }) => clanName)), ([, team]) => getAverageTeamLevel(team), 'desc')

  const teamsWithClans = clans.reduce<Teams>(([team1, team2], [, clanPlayers]) => {
    const [level1, level2] = getTeamsLevels([team1, team2])

    if (level1 > level2) {
      return [
        team1,
        [...team2, ...clanPlayers]
      ]
    } else {
      return [
        [...team1, ...clanPlayers],
        team2
      ]
    }
  }, [[], []])

  const teamsWithAll = noClanPlayers.reduce<Teams>(([team1, team2], player) => {
    const [level1, level2] = getTeamsLevels([team1, team2])

    if (level1 > level2) {
      return [
        team1,
        [...team2, player]
      ]
    } else {
      return [
        [...team1, player],
        team2
      ]
    }
  }, teamsWithClans)

  return balanceTeamsNTimes(teamsWithAll, 100, true)
}
