import { times } from 'lodash'

import config from '$/config'
import { ILogger } from '$/logger/types'

import { IGame } from './types'
import { Player, Teams } from './player/types'
import { ITable } from './table/types'
import { getBalancedTeams } from './player/balance'

const {
  NAME_COLUMN,
  COUNT_COLUMN,
  RENT_COLUMN,
  COMMENT_COLUMN,
  LEVEL_COLUMN,
  START_FROM_ROW,
  MAX_ROW_NUMBER,
  PLACE_AND_TIME_CELLS,
  DEFAULT_PLAYER_LEVEL
} = config

export class Game implements IGame {
  constructor (protected table: ITable) { }

  refreshData = async ({ logger }: { logger: ILogger }): Promise<void> => {
    await this.table.refreshData({ logger })
  }

  getPlayers = async (): Promise<Player[]> => {
    return times(MAX_ROW_NUMBER - START_FROM_ROW)
      .map(n => n + START_FROM_ROW)
      .reduce<Player[]>((players, rowNumber) => {
      const row = rowNumber.toString()
      const count = this.table.get(COUNT_COLUMN + row)
      const name = this.table.get(NAME_COLUMN + row)

      const player: Player = {
        name,
        count: +count.replace('?', '') ?? 0,
        rentCount: +this.table.get(RENT_COLUMN + row) ?? 0,
        comment: this.table.get(COMMENT_COLUMN + row),
        level: +this.table.get(LEVEL_COLUMN + row) ?? DEFAULT_PLAYER_LEVEL,
        isQuestionable: count.includes('?'),
        isCompanion: false,
        combinedName: name
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
            level: DEFAULT_PLAYER_LEVEL,
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
  }

  getTeams = async (): Promise<Teams> => {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count }) => count > 0)

    const playersToDivide = activePlayers.filter(
      ({ isQuestionable, isCompanion }) => !isQuestionable && !isCompanion
    )

    return getBalancedTeams(playersToDivide)
  }

  getPlaceAndTime = async (): Promise<string> => {
    const placeAndTime = PLACE_AND_TIME_CELLS.map((cell) => this.table.get(cell)).join(
      ', '
    )

    return placeAndTime
  }
}
