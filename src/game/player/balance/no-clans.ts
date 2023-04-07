import { chunk, orderBy } from 'lodash'

import { Player, Teams } from '../types'
import { getTeamsLevels } from './utils'
import { balanceTeamsNTimes } from '.'

export const getBalancedTeams = (players: Player[]): Teams => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')

  const dividedTeams = chunk(ratedPlayers, 2)
    .reduce<Teams>(([team1, team2], [player1, player2]) => {
    if (player2 === undefined) {
      const [level1, level2] = getTeamsLevels([team1, team2])

      if (level1 > level2) {
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
