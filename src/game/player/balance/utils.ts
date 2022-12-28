import { orderBy } from 'lodash'

import { Player, Teams } from '../types'

export const sortTeamByRating = (team: Player[]): Player[] => orderBy(team, ({ level }) => level, 'desc')

export const sortTeamsByRatings = ([team1, team2]: Teams): Teams => {
  return [
    sortTeamByRating(team1),
    sortTeamByRating(team2)
  ]
}

export const getTeamsLevels = ([team1, team2]: Teams): [number, number] => {
  const level1 = team1.reduce((result, { level }) => result + level, 0)
  const level2 = team2.reduce((result, { level }) => result + level, 0)

  return [level1, level2]
}
