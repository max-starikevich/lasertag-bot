import { orderBy, groupBy, partition } from 'lodash'

import { Player, ITeamBalancer, Teams } from '../types'
import { balanceTeamsNTimes, getAverageTeamLevel } from './utils'

export class ClansTeamBalancer implements ITeamBalancer {
  async balance (players: Player[]): Promise<Teams> {
    const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')
    const [clanPlayers, noClanPlayers] = partition(ratedPlayers, ({ isAlone }) => !isAlone)

    const clans = orderBy(Object.entries(groupBy(clanPlayers, ({ clanName }) => clanName)), ([, team]) => getAverageTeamLevel(team), 'desc')

    const teamsWithClans = clans.reduce<Teams>(([team1, team2], [, clanPlayers]) => {
      if (team1.length > team2.length) {
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
      if (team1.length > team2.length) {
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
}
