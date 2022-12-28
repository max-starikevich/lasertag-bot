import { times } from 'lodash'

import { getRandomArray } from '../../../utils.dev'
import { getBalancedTeams } from './standard'
import { Player } from '../types'
import { getTeamsLevels } from './utils'

describe('balance/standard.ts', () => {
  describe('getBalancedTeams()', () => {
    const numberOfTries = 10000
    const playerCount = 13
    const maxLevel = 6
    const targetSuccessPercentage = 99

    it(`should balance properly with ${playerCount} random players in ${targetSuccessPercentage}%+ cases after ${numberOfTries} tries`, () => {
      const successTries = times(numberOfTries).reduce((successTries) => {
        const levels = getRandomArray(playerCount, maxLevel)

        const players: Player[] = levels.map(randomLevel => ({
          name: 'random-player',
          combinedName: 'random-player',
          count: 1,
          rentCount: 0,
          comment: '',
          isQuestionable: false,
          isCompanion: false,
          level: randomLevel,
          teamName: 'random-team',
          isInTeam: true
        }))

        const balancedTeams = getBalancedTeams(players)

        const [level1, level2] = getTeamsLevels(balancedTeams)
        const levelDifference = Math.abs(level1 - level2)

        if (levelDifference > 1) {
          return successTries
        }

        return successTries + 1
      }, 0)

      expect((successTries / numberOfTries) * 100).toBeGreaterThan(targetSuccessPercentage)
    })
  })
})
