import { chunk, orderBy } from 'lodash'

import { Player, Teams } from '../types'
import { getTeamsLevels, sortTeamsByRatings } from './utils'

export const getBalancedTeams = (players: Player[]): Teams => {
  const ratedPlayers = orderBy(players, ({ level }) => level, 'desc')

  const dividedTeams = chunk(ratedPlayers, 2)
    .reduce<Teams>(([team1, team2], [player1, player2]) => {
    if (player2 === undefined) {
      const [level1, level2] = getTeamsLevels([team1, team2])

      if (level1 > level2) {
        return [
          team1,
          [...team2, player1]
        ]
      } else {
        return [
          [...team1, player1],
          team2
        ]
      }
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

  return shiftBalance([team1, team2])
}

const shiftBalance = (teams: Teams): Teams => {
  return sortTeamsByRatings(balanceBySwap(balanceByMove(teams)))
}

interface MoveCandidate {
  index: number
  level: number
}

const balanceByMove = ([team1, team2]: Teams): Teams => {
  const [level1, level2] = getTeamsLevels([team1, team2])
  const teamLevelDifference = Math.abs(level1 - level2)
  const strongTeam = level1 > level2 ? team1 : team2
  const weakTeam = level1 > level2 ? team2 : team1

  // trying to find a candidate to move from a weak team to a strong one
  const moveCandidates = strongTeam.reduce<MoveCandidate[]>((candidates, strongPlayer, index) => {
    if (strongPlayer.level <= teamLevelDifference) {
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
