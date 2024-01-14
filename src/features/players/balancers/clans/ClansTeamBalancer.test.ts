import { intersection, times } from 'lodash'

import { getRandomArray, getRandomNumber } from '$/utils.dev'

import { ClanPlayer, Player } from '$/features/players/types'
import { getTeamsLevels } from '$/features/players/balancers/utils'
import { ClansTeamBalancer } from '$/features/players/balancers/clans/ClansTeamBalancer'
import { areTwoTeamsTheSame } from '../../utils'

const basePlayer: Player = {
  tableRow: 0,
  name: 'random-player',
  combinedName: 'random-player',
  count: 1,
  rentCount: 0,
  comment: '',
  isQuestionableCount: false,
  isQuestionableRentCount: false,
  clanName: undefined,
  isClanMember: false,
  isAlone: true,
  level: 0,
  locale: 'en',
  isAdmin: false,
  gameCount: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winRate: 0
}
describe('ClansTeamBalancer', () => {
  const numberOfTries = 1000
  const playerCount = 11
  const maxLevel = 10
  const targetSuccessPercentage = 80
  const balancer = new ClansTeamBalancer()

  const clans: Array<[string, number]> = [['test1', 3], ['test2', 2], ['test3', 1], ['test4', 1], ['test5', 1]]
  const noClanPlayersCount = clans.reduce((count, [, clanPlayersCount]) => count - clanPlayersCount, playerCount)

  if (noClanPlayersCount < 0) {
    throw new Error('Too much of clan players. Reduce their number to fix this.')
  }

  it(`should balance properly with ${playerCount} random players with ${clans.length} clans in ${targetSuccessPercentage}%+ cases after ${numberOfTries} tries`, async () => {
    let successTries = 0

    for (let i = 0; i < numberOfTries; i++) {
      const levels = getRandomArray(noClanPlayersCount, maxLevel)

      const nonClanPlayers = levels.map<Player>((randomLevel, index) => ({
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
      const [team1, team2] = await balancer.balance(playersToBalance)

      const playersAfterBalance = [...team1, ...team2]

      if (!areTwoTeamsTheSame(playersToBalance, playersAfterBalance)) {
        throw new Error('Balanced playerlist mismatches the initial one')
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

      if (levelDifference <= 1) {
        successTries += 1
      }
    }

    expect((successTries / numberOfTries) * 100).toBeGreaterThanOrEqual(targetSuccessPercentage)
  })
})
