import { chunk, sortBy, times } from 'lodash'

import config from '$/config'

import { IGame } from './types'
import { IPlayer } from './player/types'
import { ITable } from './table/types'

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
  constructor (protected table: ITable) {}

  refreshData = async (): Promise<void> => {
    await this.table.refreshData()
  }

  getPlayers = async (): Promise<IPlayer[]> => {
    return times(MAX_ROW_NUMBER - START_FROM_ROW)
      .map(n => n + START_FROM_ROW)
      .reduce<IPlayer[]>((players, rowNumber) => {
      const row = rowNumber.toString()
      const count = this.table.get(COUNT_COLUMN + row)
      const name = this.table.get(NAME_COLUMN + row)

      const player: IPlayer = {
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
          .reduce<IPlayer[]>((companions, num) => {
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
            combinedName: `${player.name} ${
              companions.length > 0 ? `(${companions.length + 1})` : ''
            }`
          },
          ...companions
        )
      }

      return players
    }, [])
  }

  createTeams = async (): Promise<[IPlayer[], IPlayer[]]> => {
    const players = await this.getPlayers()

    const playersToDivide = players.filter(
      ({ isQuestionable, isCompanion }) => !isQuestionable && !isCompanion
    )

    const ratedPlayers = sortBy(playersToDivide, ({ level }) => level).reverse()
    const playerPairs = chunk(ratedPlayers, 2)

    return playerPairs.reduce<[IPlayer[], IPlayer[]]>(
      ([team1, team2], [player1, player2]) => {
        if (player2 == null) {
          return [[...team1, player1], team2]
        }

        if ((Math.random() > 0.5 ? 1 : 0) === 1) {
          return [
            [...team1, player1],
            [...team2, player2]
          ]
        }

        return [
          [...team1, player2],
          [...team2, player1]
        ]
      },
      [[], []]
    )
  }

  getPlaceAndTime = async (): Promise<string> => {
    const placeAndTime = PLACE_AND_TIME_CELLS.map((cell) => this.table.get(cell)).join(
      ', '
    )

    return placeAndTime
  }
}
