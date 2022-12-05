import { orderBy } from 'lodash'

import { IPlayer, Teams } from './types'

const MIN_PLAYERS_FOR_BALANCE_ADJUST = 3

export const tryToBalanceTeamsNTimes = (teams: Teams, attemptAmount: number): Teams => {
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
    return swapSomePlayers(team1, team2, levelDifference)
  }

  // team 2 is stronger
  if (levelDifference < 0) {
    return swapSomePlayers(team2, team1, Math.abs(levelDifference))
  }

  return teams
}

const getTeamsLevels = ([team1, team2]: Teams): [number, number] => {
  const level1 = team1.reduce((result, { level }) => result + level, 0)
  const level2 = team2.reduce((result, { level }) => result + level, 0)

  return [level1, level2]
}

const swapSomePlayers = (strongTeam: IPlayer[], weakTeam: IPlayer[], levelDifference: number): Teams => {
  if (levelDifference <= 1) {
    return [strongTeam, weakTeam]
  }

  const strongestPlayer = strongTeam[0]
  const weakerPlayerIndex = weakTeam.findIndex(({ level }) => strongestPlayer.level - level === 1)

  if (weakerPlayerIndex === -1) {
    return [strongTeam, weakTeam]
  }

  const weakerPlayer = weakTeam[weakerPlayerIndex]

  strongTeam[0] = weakerPlayer
  weakTeam[weakerPlayerIndex] = strongestPlayer

  return [
    orderBy(strongTeam, ({ level }) => level, 'desc'),
    orderBy(weakTeam, ({ level }) => level, 'desc')
  ]
}
