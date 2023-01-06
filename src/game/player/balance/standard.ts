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

  if (Math.abs(levelDifference) <= 1) {
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

const shiftBalanceByOne = (weakTeam: Player[], strongTeam: Player[]): Teams => {
  let weakerPlayerIndex = 0
  let strongerPlayerIndex = 0

  for (; strongerPlayerIndex < strongTeam.length; strongerPlayerIndex++) {
    const strongerPlayer = strongTeam[strongerPlayerIndex]

    weakerPlayerIndex = weakTeam.findIndex(({ level }) => strongerPlayer.level - level === 1)

    if (weakerPlayerIndex !== -1) {
      break
    }
  }

  const strongerPlayer: Player | undefined = strongTeam[strongerPlayerIndex]
  const weakerPlayer: Player | undefined = weakTeam[weakerPlayerIndex]

  if (strongerPlayer === undefined || weakerPlayer === undefined) {
    return [strongTeam, weakTeam]
  }

  strongTeam[strongerPlayerIndex] = weakerPlayer
  weakTeam[weakerPlayerIndex] = strongerPlayer

  return sortTeamsByRatings([strongTeam, weakTeam])
}
