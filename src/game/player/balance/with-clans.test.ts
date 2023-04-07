import { intersection, times } from 'lodash'

import { getRandomArray, getRandomNumber } from '../../../utils.dev'
import { ClanPlayer, Player } from '../types'
import { getTeamsLevels } from './utils'
import { getBalancedTeamsWithClans } from './with-clans'

const basePlayer: Player = {
  tableRow: 0,
  name: 'random-player',
  combinedName: 'random-player',
  count: 1,
  rentCount: 0,
  comment: '',
  isQuestionable: false,
  isCompanion: false,
  clanName: undefined,
  isClanMember: false,
  isAlone: true,
  level: 0
}

describe('balance/with-clans.ts', () => {
  describe('getBalancedTeamsWithClans()', () => {
    const numberOfTries = 1000
    const playerCount = 13
    const maxLevel = 10
    const targetSuccessPercentage = 91

    const clans: Array<[string, number]> = [['alpha', 3], ['bravo', 2], ['delta', 1], ['charlie', 1], ['foxtrot', 1]]
    const noClanPlayersCount = clans.reduce((count, [, clanPlayersCount]) => count - clanPlayersCount, playerCount)

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
          ...times<ClanPlayer>(clanPlayersCount, (index) => ({
            ...basePlayer,
            clanName,
            name: `${clanName}-player-${index}`,
            level: getRandomNumber(maxLevel),
            isAlone: clanPlayersCount === 1,
            isClanMember: true
          }))
        ], [])

        const [team1, team2] = getBalancedTeamsWithClans([...clanPlayers, ...nonClanPlayers])

        const team1ClanNames = [
          ...new Set(team1
            .filter(({ clanName }) => clanName !== undefined)
            .reduce<string[]>((clanNames, player) => [...clanNames, player.clanName as string], [])
          )
        ]

        const team2ClanNames = [
          ...new Set(team2
            .filter(({ clanName }) => clanName !== undefined)
            .reduce<string[]>((clanNames, player) => [...clanNames, player.clanName as string], [])
          )
        ]

        const sameClansInBothTeams = intersection(team1ClanNames, team2ClanNames)

        if (sameClansInBothTeams.length > 0) {
          throw new Error('The same clan name occured in two teams after getBalancedTeamsWithClans()')
        }

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
