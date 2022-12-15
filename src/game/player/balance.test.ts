import { getRandomArray } from '../../utils'

import { Player } from './types'
import { getBalancedTeams, getTeamsLevels } from './balance'
import { times } from 'lodash'

type BaseTestPlayer = Pick<Player, 'name' | 'combinedName' | 'count' | 'rentCount' | 'comment' | 'isQuestionable' | 'isCompanion'>

const base: BaseTestPlayer = {
  name: 'player',
  combinedName: 'player',
  count: 1,
  rentCount: 0,
  comment: '',
  isQuestionable: false,
  isCompanion: false
}

describe('balance.ts', () => {
  describe('getBalancedTeams()', () => {
    const numberOfTries = 10000
    const playerCount = 13
    const maxLevel = 6
    const targetSuccessPercentage = 99

    it(`should balance properly with ${playerCount} random players in ${targetSuccessPercentage}%+ cases`, () => {
      const successTries = times(numberOfTries).reduce((successTries) => {
        const levels = getRandomArray(playerCount, maxLevel)

        const players = levels.map(level => ({
          ...base, level
        }))

        const balancedTeams = getBalancedTeams(players)

        const [level1, level2] = getTeamsLevels(balancedTeams)
        const levelDifference = Math.abs(level1 - level2)

        if (levelDifference > 1) {
          return successTries
        }

        return successTries + 1
      }, 0)

      console.debug({
        successTries,
        numberOfTries,
        maxLevel,
        playerCount,
        targetSuccessPercentage
      })

      expect((successTries / numberOfTries) * 100).toBeGreaterThan(targetSuccessPercentage)
    })
  })
})
