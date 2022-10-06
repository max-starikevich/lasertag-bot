import { chunk, partition, sortBy } from 'lodash'

import config from '$/config'

import { IGame } from './types'
import { IPlayer, IPlayers } from './player/types'
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

  getPlayers = async (): Promise<IPlayers> => {
    const all: IPlayer[] = []

    for (let rowNumber = START_FROM_ROW; rowNumber < MAX_ROW_NUMBER; rowNumber++) {
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
        all.push(player)
      }

      if (player.count > 1) {
        const combinedPlayers: IPlayer[] = []

        for (
          let i = 1, rentCount = player.rentCount;
          i <= player.count;
          i++, rentCount--
        ) {
          const isCompanion = i > 1

          combinedPlayers.push({
            ...player,
            name: player.name + (isCompanion ? ` (${i})` : ''),
            count: 1,
            rentCount: rentCount > 0 ? 1 : 0,
            comment: isCompanion ? '' : player.comment,
            level: isCompanion ? DEFAULT_PLAYER_LEVEL : player.level,
            isCompanion
          })
        }

        const [main, ...companions] = combinedPlayers

        all.push(
          {
            ...main,
            combinedName: `${main.name} ${
              companions.length > 0 ? `(${companions.length + 1})` : ''
            }`
          },
          ...companions
        )
      }
    }

    const [ready, questionable] = partition(
      all,
      ({ isQuestionable }) => !isQuestionable
    )

    return {
      all,
      ready,
      questionable
    }
  }

  createTeams = async (): Promise<[IPlayer[], IPlayer[]]> => {
    const { ready: readyPlayers } = await this.getPlayers()

    const [playersToDivide] = partition(
      readyPlayers,
      ({ isCompanion }) => !isCompanion
    )

    if (playersToDivide.length < 2) {
      return [[...readyPlayers], []]
    }

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
