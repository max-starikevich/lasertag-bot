import { times } from 'lodash'

import { getRandomArray, getRandomNumber } from '../../../utils.dev'
import { ClanPlayer, Player } from '../types'
import { getTeamsLevels } from './utils'
import { getBalancedTeamsWithClans } from './clans'

const basePlayer: Player = {
  name: 'random-player',
  combinedName: 'random-player',
  count: 1,
  rentCount: 0,
  comment: '',
  isQuestionable: false,
  isCompanion: false,
  clanName: undefined,
  isClanMember: false,
  isAloneInClan: true,
  level: 0
}

describe('balance/clans.ts', () => {
  describe('getBalancedTeamsWithClans()', () => {
    const numberOfTries = 10000
    const playerCount = 20
    const clans: Array<[string, number]> = [['alpha', 3], ['bravo', 2], ['delta', 1]]
    const noClanPlayersCount = clans.reduce((count, [, clanPlayersCount]) => count - clanPlayersCount, playerCount)
    const maxLevel = 14
    const targetSuccessPercentage = 70

    it(`should balance properly with ${playerCount} random players with ${clans.length} clans in ${targetSuccessPercentage}%+ cases after ${numberOfTries} tries`, () => {
      const successTries = times(numberOfTries).reduce((successTries) => {
        const levels = getRandomArray(noClanPlayersCount, maxLevel)

        const nonClanPlayers: Player[] = levels.map((randomLevel, index) => ({
          ...basePlayer,
          name: `player-${index}`,
          level: randomLevel
        }))

        const clanPlayers = clans.reduce<ClanPlayer[]>((players, [clanName, clanPlayersCount]) => [
          ...players,
          ...times(clanPlayersCount, (index) => ({
            ...basePlayer,
            clanName,
            name: `${clanName}-player-${index}`,
            level: getRandomNumber(maxLevel),
            isAloneInClan: false,
            isClanMember: true
          }))
        ], [])

        const [team1, team2] = getBalancedTeamsWithClans([...clanPlayers, ...nonClanPlayers])

        const [level1, level2] = getTeamsLevels([team1, team2])
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
