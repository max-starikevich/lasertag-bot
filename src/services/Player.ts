import { chunk, sortBy } from 'lodash'

export interface Player {
  name: string
  combinedName: string
  count: number
  rentCount: number
  comment: string
  level: number
  isQuestionable: boolean
  isCompanion: boolean
}

const getRandomOneOrZero = (): number => (Math.random() > 0.5 ? 1 : 0)

export type Teams = [Player[], Player[]]

export const getBalancedTeams = (players: Player[]): Teams => {
  if (players.length < 2) {
    return [[...players], []]
  }

  const ratedPlayers = sortBy(players, ({ level }) => level).reverse()
  const playerPairs = chunk(ratedPlayers, 2)

  return playerPairs.reduce<Teams>(
    ([team1, team2], [player1, player2]) => {
      if (player2 == null) {
        return [[...team1, player1], team2]
      }

      if (getRandomOneOrZero() === 1) {
        return [
          [...team1, player1],
          [...team2, player2]
        ]
      }

      return [
        [...team1, player2],
        [...team2, player1]
      ]
    },
    [[], []]
  )
}
