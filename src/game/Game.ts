import { groupBy, times } from 'lodash'

import config from '$/config'
import { BaseLogger } from '$/logger/types'

import { BaseTable } from './table/types'
import { BaseGame } from './types'
import { Player, Teams } from './player/types'
import { getBalancedTeams } from './player/balance/standard'
import { getBalancedTeamsWithClans } from './player/balance/clans'

const {
  NAME_COLUMN,
  RATING_COLUMN,
  TEAM_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  START_FROM_ROW,
  MAX_ROW_NUMBER,
  PLACE_AND_TIME_CELLS,
  DEFAULT_RATING_LEVEL
} = config

export class Game implements BaseGame {
  constructor (protected table: BaseTable) {}

  refreshData = async ({ logger }: { logger: BaseLogger }): Promise<void> => {
    await this.table.refreshData({ logger })
  }

  getPlayers = async (): Promise<Player[]> => {
    const players = times(MAX_ROW_NUMBER - START_FROM_ROW)
      .map(n => n + START_FROM_ROW)
      .reduce<Player[]>((players, rowNumber) => {
      const row = rowNumber.toString()

      const name = this.table.get(NAME_COLUMN + row)

      if (name === undefined) {
        return players
      }

      const rawCount = (this.table.get(COUNT_COLUMN + row) ?? '0')
      const count = +(rawCount.replace('?', ''))
      const rentCount = +(this.table.get(RENT_COLUMN + row) ?? '0')
      const level = +(this.table.get(RATING_COLUMN + row) ?? `${DEFAULT_RATING_LEVEL}`)
      const comment = this.table.get(COMMENT_COLUMN + row) ?? ''
      const teamName = this.table.get(TEAM_COLUMN + row)

      const player: Player = {
        name,
        count,
        rentCount,
        comment,
        level,
        isQuestionable: rawCount.includes('?'),
        isCompanion: false,
        combinedName: name,
        teamName,
        isTeamMember: teamName !== undefined,
        isAloneInTeam: true
      }

      if (player.count === 1) {
        players.push(player)
      }

      if (player.count > 1) {
        const companions = times(player.count - 1)
          .map(n => n + 1)
          .reduce<Player[]>((companions, num) => {
          const rentCount = player.rentCount - num

          companions.push({
            ...player,
            name: `${player.name} (${num + 1})`,
            count: 1,
            rentCount: rentCount > 0 ? 1 : 0,
            comment: '',
            level: DEFAULT_RATING_LEVEL,
            isCompanion: true
          })

          return companions
        }, [])

        players.push(
          {
            ...player,
            rentCount: player.rentCount > 0 ? 1 : 0,
            combinedName: `${player.name} ${companions.length > 0 ? `(${companions.length + 1})` : ''
                }`
          },
          ...companions
        )
      }

      if (player.count === 0 && player.comment.length > 0) {
        players.push(player)
      }

      return players
    }, [])

    const clans = groupBy(
      players.filter(({ isTeamMember }) => isTeamMember),
      ({ teamName }) => teamName
    )

    return players.map(p => ({
      ...p,
      isAloneInTeam: p.teamName === undefined || clans[p.teamName].length < 2
    }))
  }

  getTeams = async (): Promise<Teams> => {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count }) => count > 0)

    const playersToDivide = activePlayers.filter(
      ({ isQuestionable, isCompanion }) => !isQuestionable && !isCompanion
    )

    return getBalancedTeams(playersToDivide)
  }

  getTeamsWithClans = async (): Promise<Teams> => {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count }) => count > 0)

    const playersToDivide = activePlayers.filter(
      ({ isQuestionable, isCompanion }) => !isQuestionable && !isCompanion
    )

    return getBalancedTeamsWithClans(playersToDivide)
  }

  getPlaceAndTime = async (): Promise<string> => {
    return PLACE_AND_TIME_CELLS.map((cell) =>
      this.table.get(cell)).join(
      ', '
    )
  }
}
