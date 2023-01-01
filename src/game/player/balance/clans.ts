import { orderBy, groupBy, partition } from 'lodash'
import { Player, Teams } from '../types'
import { getTeamsLevels, sortTeamsByRatings } from './utils'

export const getBalancedTeamsWithClans = (players: Player[]): Teams => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')
  const [clanPlayers, noClanPlayers] = partition(ratedPlayers, ({ isTeamMember }) => isTeamMember)

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

const shiftBalanceByOne = (weakTeam: Player[], strongTeam: Player[]): Teams => {
  let weakerPlayerIndex = 0
  let strongerPlayerIndex = 0

  for (; strongerPlayerIndex < strongTeam.length; strongerPlayerIndex++) {
    const strongerPlayer = strongTeam[strongerPlayerIndex]

    if (strongerPlayer.isTeamMember) {
      continue
    }

    weakerPlayerIndex = weakTeam.findIndex(({ level, isTeamMember }) => !isTeamMember && strongerPlayer.level - level === 1)

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