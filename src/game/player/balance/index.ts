import { orderBy } from 'lodash'

import { Teams } from '../types'
import { getTeamsLevels, sortTeamsByRatings } from './utils'

export const balanceTeamsNTimes = (teams: Teams, attemptAmount: number, withClans: boolean): Teams => {
  let currentTeams = teams

  for (let n = 1; n <= attemptAmount; n++) {
    currentTeams = balanceByMove(currentTeams, withClans)
    currentTeams = balanceBySwap(currentTeams, withClans)
    currentTeams = sortTeamsByRatings(currentTeams)

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

const balanceByMove = ([team1, team2]: Teams, withClans: boolean): Teams => {
  const [level1, level2] = getTeamsLevels([team1, team2])
  const levelDifference = Math.abs(level1 - level2)

  const strongTeam = level1 > level2 ? team1 : team2
  const weakTeam = level1 > level2 ? team2 : team1

  const moveCandidates = strongTeam.reduce<MoveCandidate[]>((candidates, strongPlayer, index) => {
    if (withClans && !strongPlayer.isAlone) {
      return candidates
    }

    if (strongPlayer.level <= levelDifference) {
      return [...candidates, { index, level: strongPlayer.level }]
    }

    return candidates
  }, [])

  const bestMoveCandidate = orderBy(moveCandidates, ({ level }) => level, 'desc')[0]

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

const balanceBySwap = ([team1, team2]: Teams, withClans: boolean): Teams => {
  const [level1, level2] = getTeamsLevels([team1, team2])
  const levelDifference = Math.abs(level1 - level2)

  const strongTeam = level1 > level2 ? team1 : team2
  const weakTeam = level1 > level2 ? team2 : team1

  const swapCandidates: SwapCandidate[] = []

  for (let strongerPlayerIndex = 0; strongerPlayerIndex < strongTeam.length; strongerPlayerIndex++) {
    for (let weakerPlayerIndex = 0; weakerPlayerIndex < weakTeam.length; weakerPlayerIndex++) {
      const strongerPlayer = strongTeam[strongerPlayerIndex]
      const weakerPlayer = weakTeam[weakerPlayerIndex]

      if (withClans && (!strongerPlayer.isAlone || !weakerPlayer.isAlone)) {
        continue
      }

      const playerDifference = strongerPlayer.level - weakerPlayer.level

      if (playerDifference > 0 && playerDifference <= levelDifference / 2) {
        swapCandidates.push({
          strongerPlayerIndex,
          weakerPlayerIndex,
          playerDifference
        })
      }
    }
  }

  if (swapCandidates.length === 0) {
    return [strongTeam, weakTeam]
  }

  const bestCandidate = orderBy(swapCandidates, ({ playerDifference }) => playerDifference, 'desc')[0]

  const { strongerPlayerIndex, weakerPlayerIndex } = bestCandidate

  const strongerPlayer = strongTeam[strongerPlayerIndex]
  const weakerPlayer = weakTeam[weakerPlayerIndex]

  strongTeam[strongerPlayerIndex] = weakerPlayer
  weakTeam[weakerPlayerIndex] = strongerPlayer

  return [strongTeam, weakTeam]
}
