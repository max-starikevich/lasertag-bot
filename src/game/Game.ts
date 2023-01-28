import { groupBy, times } from 'lodash'

import config from '$/config'
import { BaseLogger } from '$/logger/types'

import { BaseTable } from './table/types'
import { BaseGame } from './types'
import { ClanPlayer, Player, Teams } from './player/types'
import { getBalancedTeams } from './player/balance/classic'
import { getBalancedTeamsWithClans } from './player/balance/clans'
import { sortTeamsByClans } from './player/balance/utils'

const {
  NAME_COLUMN,
  RATING_COLUMN,
  CLAN_COLUMN,
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
      const clanName = this.table.get(CLAN_COLUMN + row)

      const player: Player = {
        name,
        count,
        rentCount,
        comment,
        level,
        isQuestionable: rawCount.includes('?'),
        isCompanion: false, // will be overriden later
        combinedName: name,
        clanName,
        clanEmoji: clanName?.match(/\p{Emoji}+/gu)?.[0],
        isClanMember: clanName !== undefined,
        isAloneInClan: true // will be overriden later
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
            isCompanion: true,
            isAloneInClan: true,
            isClanMember: false,
            clanEmoji: undefined,
            clanName: undefined
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
      } else {
        players.push(player)
      }

      return players
    }, [])

    const clans = groupBy(
      players.filter(({ isClanMember, count }) => isClanMember && count > 0),
      ({ clanName }) => clanName
    )

    return players.map(p => {
      if (
        p.clanName === undefined ||
        clans[p.clanName] === undefined ||
        clans[p.clanName].length < 2
      ) {
        return p
      }

      return {
        ...p,
        isAloneInClan: false
      }
    })
  }

  getClanPlayers = async (): Promise<ClanPlayer[]> => {
    const players = await this.getPlayers()
    return players.filter((player): player is ClanPlayer => player.clanName != null)
  }

  getTeams = async (): Promise<Teams> => {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count, level }) => count > 0 && level > 0)

    const playersToDivide = activePlayers.filter(
      ({ isQuestionable, isCompanion }) => !isQuestionable && !isCompanion
    )

    return getBalancedTeams(playersToDivide)
  }

  getTeamsWithClans = async (): Promise<Teams> => {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count, level }) => count > 0 && level > 0)

    const playersToDivide = activePlayers.filter(
      ({ isQuestionable, isCompanion }) => !isQuestionable && !isCompanion
    )

    const [team1, team2] = getBalancedTeamsWithClans(playersToDivide)

    return sortTeamsByClans([team1, team2])
  }

  getPlaceAndTime = async (): Promise<string> => {
    return PLACE_AND_TIME_CELLS.map((cell) =>
      this.table.get(cell)).join(
      ', '
    )
  }
}
