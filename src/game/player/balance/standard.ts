import { chunk, orderBy } from 'lodash'

import { Player, Teams } from '../types'
import { getTeamsLevels, sortTeamsByRatings } from './utils'

export const getBalancedTeams = (players: Player[]): Teams => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')

  const dividedTeams = chunk(ratedPlayers, 2)
    .reduce<Teams>(([team1, team2], [player1, player2]) => {
    if (player2 === undefined) {
      return [[...team1, player1], team2]
    }

    return [[...team1, player1], [...team2, player2]]
  }, [[], []])

  return balanceTeamsNTimes(dividedTeams, 100)
}

const balanceTeamsNTimes = (teams: Teams, attemptAmount: number): Teams => {
  let currentTeams = teams

  for (let n = 1; n <= attemptAmount; n++) {
    currentTeams = balanceTeams(currentTeams)
    const [level1, level2] = getTeamsLevels(currentTeams)

    if (Math.abs(level1 - level2) <= 1) {
      break
    }
  }

  return currentTeams
}

const balanceTeams = (teams: Teams): Teams => {
  const [team1, team2] = teams
  const [level1, level2] = getTeamsLevels(teams)

  const levelDifference = level1 - level2

  if (levelDifference <= 1) {
    return teams
  }

  // team 1 is stronger
  if (levelDifference > 0) {
    return shiftBalanceByOne(team2, team1)
  }

  // team 2 is stronger
  if (levelDifference < 0) {
    return shiftBalanceByOne(team1, team2)
  }

  return teams
}

const shiftBalanceByOne = (team1: Player[], team2: Player[]): Teams => {
  let player1Index = 0
  let player2Index = 0

  for (; player2Index < team2.length; player2Index++) {
    const player2 = team2[player2Index]

    player1Index = team1.findIndex(({ level }) => player2.level - level === 1)

    if (player1Index !== -1) {
      break
    }
  }

  const player2: Player | undefined = team2[player2Index]
  const player1: Player | undefined = team1[player1Index]

  if (player2 === undefined || player1 === undefined) {
    return [team2, team1]
  }

  team2[player2Index] = player1
  team1[player1Index] = player2

  return sortTeamsByRatings([team1, team2])
}
