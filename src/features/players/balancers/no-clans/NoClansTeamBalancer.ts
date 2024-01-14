import { chunk, orderBy } from 'lodash'

import { Player, ITeamBalancer, Teams } from '../../types'
import { balanceTeamsNTimes } from '../utils'

export class NoClansTeamBalancer implements ITeamBalancer {
  async balance (players: Player[]): Promise<Teams> {
    const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')

    const dividedTeams = chunk(ratedPlayers, 2)
      .reduce<Teams>(([team1, team2], [player1, player2]) => {
      if (player2 === undefined) {
        if (team1.length > team2.length) {
          return [
            team1,
            [...team2, player1]
          ]
        } else {
          return [
            [...team1, player1],
            team2
          ]
        }
      }

      return [[...team1, player1], [...team2, player2]]
    }, [[], []])

    return balanceTeamsNTimes(dividedTeams, 100, false)
  }
}
