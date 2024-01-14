import { getRandomArray } from '$/utils.dev'
import { Player } from '$/features/players/types'
import { getTeamsLevels } from '$/features/players/balancers/utils'

import { NoClansTeamBalancer } from './NoClansTeamBalancer'
import { areTwoTeamsTheSame } from '../../utils'

describe('NoClansTeamBalancer', () => {
  const numberOfTries = 1000
  const playerCount = 7
  const maxLevel = 10
  const targetSuccessPercentage = 88
  const balancer = new NoClansTeamBalancer()

  it(`should balance properly with ${playerCount} random players in ${targetSuccessPercentage}%+ cases after ${numberOfTries} tries`, async () => {
    let successTries = 0

    for (let i = 0; i < numberOfTries; i++) {
      const levels = getRandomArray(playerCount, maxLevel)

      const playersToBalance = levels.map<Player>(randomLevel => ({
        tableRow: 0,
        name: 'random-player',
        combinedName: 'random-player',
        count: 1,
        rentCount: 0,
        comment: '',
        isQuestionableCount: false,
        isQuestionableRentCount: false,
        isCompanion: false,
        level: randomLevel,
        clanName: 'random-team',
        isClanMember: true,
        isAlone: true,
        locale: 'en',
        isAdmin: false,
        gameCount: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0
      }))

      const [team1, team2] = await balancer.balance(playersToBalance)

      const playersAfterBalance = [...team1, ...team2]

      if (!areTwoTeamsTheSame(playersToBalance, playersAfterBalance)) {
        throw new Error('Balanced playerlist mismatches the initial one')
      }

      const [level1, level2] = getTeamsLevels([team1, team2])

      const levelDifference = Math.abs(level1 - level2)

      if (levelDifference <= 1) {
        successTries += 1
      }
    }

    expect((successTries / numberOfTries) * 100).toBeGreaterThanOrEqual(targetSuccessPercentage)
  })
})
