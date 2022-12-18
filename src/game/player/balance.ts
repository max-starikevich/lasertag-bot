import { chunk, orderBy } from 'lodash'

import { Player, Teams } from './types'

export const MIN_PLAYERS_FOR_BALANCE_ADJUST = 5

export const getTeamsLevels = ([team1, team2]: Teams): [number, number] => {
  const level1 = team1.reduce((result, { level }) => result + level, 0)
  const level2 = team2.reduce((result, { level }) => result + level, 0)

  return [level1, level2]
}

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

export const balanceTeamsNTimes = (teams: Teams, attemptAmount: number): Teams => {
  if (teams[0].length < MIN_PLAYERS_FOR_BALANCE_ADJUST) {
    return teams
  }

  if (teams[1].length < MIN_PLAYERS_FOR_BALANCE_ADJUST) {
    return teams
  }

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
    return strengthenWeakTeam(team2, team1, levelDifference)
  }

  // team 2 is stronger
  if (levelDifference < 0) {
    return strengthenWeakTeam(team1, team2, Math.abs(levelDifference))
  }

  return teams
}

const strengthenWeakTeam = (weakTeam: Player[], strongTeam: Player[], levelDifference: number): Teams => {
  if (levelDifference <= 1) {
    return [strongTeam, weakTeam]
  }

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

  return [
    orderBy(strongTeam, ({ level }) => level, 'desc'),
    orderBy(weakTeam, ({ level }) => level, 'desc')
  ]
}
