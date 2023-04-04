import { GameStorage } from './storage/types'
import { GameLocation, BaseGame } from './types'
import { ClanPlayer, Player, Teams } from './player/types'
import { getBalancedTeams } from './player/balance/classic'
import { getBalancedTeamsWithClans } from './player/balance/clans'
import { sortTeamsByClans } from './player/balance/utils'
import { Locales } from '$/lang/i18n-types'

interface GameConstructorParams {
  storage: GameStorage
}

export class Game implements BaseGame {
  protected storage: GameStorage

  constructor ({ storage }: GameConstructorParams) {
    this.storage = storage
  }

  getPlayers = async (): Promise<Player[]> => {
    return await this.storage.getPlayers()
  }

  getPlaceAndTime = async (lang: Locales): Promise<GameLocation> => {
    return await this.storage.getPlaceAndTime(lang)
  }

  getClanPlayers = async (): Promise<ClanPlayer[]> => {
    const players = await this.getPlayers()
    return players.filter((player): player is ClanPlayer => player.clanName !== undefined)
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

  registerPlayer = async (tableRow: number, userId: number): Promise<Player> => {
    const players = await this.storage.getPlayers()

    const targetPlayer = players.find(({ telegramUserId }) => telegramUserId === userId)

    if (targetPlayer == null) {
      throw new Error()
    }

    return targetPlayer
  }
}
