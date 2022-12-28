import { orderBy, groupBy, partition } from 'lodash'
import { Player, Teams } from '../types'
import { getTeamsLevels, sortTeamsByRatings } from './utils'

export const getBalancedTeamsWithClans = (players: Player[]): Teams => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')
  const [clanPlayers, noClanPlayers] = partition(ratedPlayers, ({ isInTeam }) => isInTeam)

  const clans = orderBy(Object.entries(groupBy(clanPlayers, ({ teamName }) => teamName)), ([, players]) => players.length, 'desc')

  const teamsWithClans = clans.reduce<Teams>(([team1, team2], [, players]) => {
    if (team1.length > team2.length) {
      return [
        team1,
        [...team2, ...players]

      ]
    } else {
      return [
        [...team1, ...players],
        team2
      ]
    }
  }, [[], []])

  const [team1, team2] = noClanPlayers.reduce<Teams>(([team1, team2], player) => {
    const [team1Level, team2Level] = getTeamsLevels([team1, team2])

    if (team1Level > team2Level) {
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

  return balanceTeamsNTimes(
    sortTeamsByRatings([team1, team2]),
    100
  )
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

    if (player2.isInTeam) {
      continue
    }

    player1Index = team1.findIndex(({ level }) => !player2.isInTeam && player2.level - level === 1)

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

  return sortTeamsByRatings([team2, team1])
}
