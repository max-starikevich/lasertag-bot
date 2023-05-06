import { difference, intersection, times } from 'lodash'

import { getRandomArray, getRandomNumber } from '../../../utils.dev'
import { ClanPlayer, Player } from '../types'
import { getTeamsLevels } from './'
import { getBalancedTeamsWithClans } from './with-clans'

const basePlayer: Player = {
  tableRow: 0,
  name: 'random-player',
  combinedName: 'random-player',
  count: 1,
  rentCount: 0,
  comment: '',
  isQuestionable: false,
  clanName: undefined,
  isClanMember: false,
  isAlone: true,
  level: 0
}

describe('balance/with-clans.ts', () => {
  describe('getBalancedTeamsWithClans()', () => {
    const numberOfTries = 1000
    const playerCount = 11
    const maxLevel = 10
    const targetSuccessPercentage = 55

    const clans: Array<[string, number]> = [['test1', 4], ['test2', 3], ['test3', 1], ['test4', 1], ['test5', 1]]
    const noClanPlayersCount = clans.reduce((count, [, clanPlayersCount]) => count - clanPlayersCount, playerCount)

    if (noClanPlayersCount < 0) {
      throw new Error('Too much of clan players. Reduce their number to fix this.')
    }

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

        const playersToBalance = [...clanPlayers, ...nonClanPlayers]
        const [team1, team2] = getBalancedTeamsWithClans(playersToBalance)

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
          throw new Error('The same clan name occured in both teams')
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
