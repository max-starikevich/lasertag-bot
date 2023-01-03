import { orderBy, groupBy, partition } from 'lodash'
import { Player, Teams, TeamsWithLevelDifference } from '../types'
import { getTeamsLevels, sortTeamsByRatings } from './utils'

export const getBalancedTeamsWithClans = (players: Player[]): TeamsWithLevelDifference => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')
  const [clanPlayers, noClanPlayers] = partition(ratedPlayers, ({ isTeamMember, isAloneInTeam }) => isTeamMember && !isAloneInTeam)

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

  const teamsWithAllPlayers = noClanPlayers.reduce<Teams>(([team1, team2], player) => {
    if (team1.length > team2.length) {
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

  const [team1, team2] = balanceTeamsNTimes(teamsWithAllPlayers, 100)
  const [level1, level2] = getTeamsLevels([team1, team2])

  return [team1, team2, level1 - level2]
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

    if (strongerPlayer.isTeamMember) {
      continue
    }

    weakerPlayerIndex = weakTeam.findIndex(({ level, isAloneInTeam }) => isAloneInTeam && strongerPlayer.level - level === 1)

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
