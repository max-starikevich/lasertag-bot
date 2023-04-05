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
    currentTeams = sortTeamsByRatings(balanceBySwap(balanceByMove(currentTeams)))
    const [level1, level2] = getTeamsLevels(currentTeams)

    if (Math.abs(level1 - level2) <= 1) {
      break
    }
  }

  return currentTeams
}

interface MoveCandidate {
  index: number
  level: number
}

const balanceByMove = ([team1, team2]: Teams): Teams => {
  const [level1, level2] = getTeamsLevels([team1, team2])
  const levelDifference = Math.abs(level1 - level2)
  const strongTeam = level1 > level2 ? team1 : team2
  const weakTeam = level1 > level2 ? team2 : team1

  // trying to find a candidate to move from a weak team to a strong one
  const moveCandidates = strongTeam.reduce<MoveCandidate[]>((candidates, strongPlayer, index) => {
    if (strongPlayer.level <= levelDifference && strongPlayer.isAloneInClan) {
      return [...candidates, { index, level: strongPlayer.level }]
    }

    return candidates
  }, [])

  const bestMoveCandidate = moveCandidates[0]

  if (bestMoveCandidate === undefined) {
    return [strongTeam, weakTeam]
  }

  const { index } = bestMoveCandidate
  const playerToMove = strongTeam[index]

  strongTeam.splice(index, 1)
  weakTeam.push(playerToMove)

  return [strongTeam, weakTeam]
}

interface SwapCandidate {
  strongerPlayerIndex: number
  weakerPlayerIndex: number
  playerDifference: number
}

const balanceBySwap = ([team1, team2]: Teams): Teams => {
  const [level1, level2] = getTeamsLevels([team1, team2])
  const levelDifference = Math.abs(level1 - level2)
  const strongTeam = level1 > level2 ? team1 : team2
  const weakTeam = level1 > level2 ? team2 : team1

  const swapCandidatesRaw: SwapCandidate[] = []

  for (let strongerPlayerIndex = 0; strongerPlayerIndex < strongTeam.length; strongerPlayerIndex++) {
    for (let weakerPlayerIndex = 0; weakerPlayerIndex < weakTeam.length; weakerPlayerIndex++) {
      const strongerPlayer = strongTeam[strongerPlayerIndex]
      const weakerPlayer = weakTeam[weakerPlayerIndex]

      if (!strongerPlayer.isAloneInClan || !weakerPlayer.isAloneInClan) {
        continue
      }

      const playerDifference = strongerPlayer.level - weakerPlayer.level

      if (playerDifference > 0 && playerDifference <= levelDifference / 2) {
        swapCandidatesRaw.push({
          strongerPlayerIndex,
          weakerPlayerIndex,
          playerDifference
        })
      }
    }
  }

  const swapCandidates = orderBy(swapCandidatesRaw, ({ playerDifference }) => playerDifference, 'desc')

  if (swapCandidates.length === 0) {
    return [strongTeam, weakTeam]
  }

  const bestCandidate = swapCandidates[0]

  const { strongerPlayerIndex, weakerPlayerIndex } = bestCandidate

  const strongerPlayer = strongTeam[strongerPlayerIndex]
  const weakerPlayer = weakTeam[weakerPlayerIndex]

  strongTeam[strongerPlayerIndex] = weakerPlayer
  weakTeam[weakerPlayerIndex] = strongerPlayer

  return [strongTeam, weakTeam]
}
