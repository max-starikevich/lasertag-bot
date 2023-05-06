import { difference, times } from 'lodash'

import { getRandomArray } from '../../../utils.dev'
import { getBalancedTeams } from './no-clans'
import { Player } from '../types'
import { getTeamsLevels } from './'

describe('balance/no-clans.ts', () => {
  describe('getBalancedTeams()', () => {
    const numberOfTries = 1000
    const playerCount = 7
    const maxLevel = 10
    const targetSuccessPercentage = 88

    it(`should balance properly with ${playerCount} random players in ${targetSuccessPercentage}%+ cases after ${numberOfTries} tries`, () => {
      const successTries = times(numberOfTries).reduce((successTries) => {
        const levels = getRandomArray(playerCount, maxLevel)

        const playersToBalance: Player[] = levels.map(randomLevel => ({
          tableRow: 0,
          name: 'random-player',
          combinedName: 'random-player',
          count: 1,
          rentCount: 0,
          comment: '',
          isQuestionable: false,
          isCompanion: false,
          level: randomLevel,
          clanName: 'random-team',
          isClanMember: true,
          isAlone: true
        }))

        const [team1, team2] = getBalancedTeams(playersToBalance)

        if (Math.abs(team1.length - team2.length) > 1) {
          throw new Error('Teams are not equal in size')
        }

        const playersAfterBalance = [...team1, ...team2]

        if (playersToBalance.length !== playersAfterBalance.length) {
          throw new Error('Final player list differs from the initial one')
        }

        if (difference(playersToBalance, playersAfterBalance).length > 0) {
          throw new Error('Final player list differs from the initial one')
        }

        const [level1, level2] = getTeamsLevels([team1, team2])

        const levelDifference = Math.abs(level1 - level2)

        if (levelDifference > 1) {
          return successTries
        }

        return successTries + 1
      }, 0)

      expect((successTries / numberOfTries) * 100).toBeGreaterThanOrEqual(targetSuccessPercentage)
    })
  })
})
