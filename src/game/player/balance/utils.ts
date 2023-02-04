import { orderBy } from 'lodash'

import { Player, Teams } from '../types'

const sortTeamByRating = (team: Player[]): Player[] => orderBy(team, ({ level }) => level, 'desc')

export const sortTeamsByRatings = ([team1, team2]: Teams): Teams => {
  return [
    sortTeamByRating(team1),
    sortTeamByRating(team2)
  ]
}

const sortTeamByClans = (team: Player[]): Player[] => orderBy(team, ({ clanName }) => clanName, 'asc')

export const sortTeamsByClans = ([team1, team2]: Teams): Teams => {
  return [
    sortTeamByClans(team1),
    sortTeamByClans(team2)
  ]
}

export const getTeamsLevels = ([team1, team2]: Teams): [number, number] => {
  const level1 = getTeamLevel(team1)
  const level2 = getTeamLevel(team2)

  return [level1, level2]
}

export const getTeamLevel = (team: Player[]): number => {
  return team.reduce((result, { level }) => result + level, 0)
}

export const getAverageTeamLevel = (team: Player[]): number => {
  return getTeamLevel(team) / team.length
}
