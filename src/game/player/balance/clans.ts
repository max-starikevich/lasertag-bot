import { orderBy, groupBy, partition } from 'lodash'

import { Player, Teams } from '../types'
import { getAverageTeamLevel, getTeamsLevels, sortTeamsByRatings } from './utils'

export const getBalancedTeamsWithClans = (players: Player[]): Teams => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')
  const [clanPlayers, noClanPlayers] = partition(ratedPlayers, ({ isClanMember }) => isClanMember)

  const clans = orderBy(Object.entries(groupBy(clanPlayers, ({ clanName }) => clanName)), ([, team]) => getAverageTeamLevel(team), 'desc')

  const teamsWithClans = clans.reduce<Teams>(([team1, team2], [, clanPlayers]) => {
    const [level1, level2] = getTeamsLevels([team1, team2])

    if (level1 > level2) {
      return [
        team1,
        [...team2, ...clanPlayers]
      ]
    } else {
      return [
        [...team1, ...clanPlayers],
        team2
      ]
    }
  }, [[], []])

  const teamsWithAll = noClanPlayers.reduce<Teams>(([team1, team2], player) => {
    const [level1, level2] = getTeamsLevels([team1, team2])

    if (level1 > level2) {
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

  return balanceTeamsNTimes(teamsWithAll, 100)
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
    return shiftBalance(team2, team1)
  }

  // team 2 is stronger
  if (levelDifference < 0) {
    return shiftBalance(team1, team2)
  }

  return teams
}

const shiftBalance = (weakTeam: Player[], strongTeam: Player[]): Teams => {
  let weakerPlayerIndex = 0
  let strongerPlayerIndex = 0

  for (; strongerPlayerIndex < strongTeam.length; strongerPlayerIndex++) {
    const strongerPlayer = strongTeam[strongerPlayerIndex]

    if (!strongerPlayer.isAloneInClan) {
      continue
    }

    weakerPlayerIndex = weakTeam.findIndex(({ level, isAloneInClan }) => isAloneInClan && strongerPlayer.level - level === 1)

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
