import { GameStorage } from './storage/types'
import { GameLocation, BaseGame, GameLink } from './types'
import { ClanPlayer, Player, UpdatedPlayer, Teams } from './player/types'
import { getBalancedTeams } from './player/balance/no-clans'
import { getBalancedTeamsWithClans } from './player/balance/with-clans'
import { sortTeamsByClans } from './player/balance'

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

  getPlaceAndTime = async (): Promise<GameLocation[]> => {
    return await this.storage.getPlaceAndTime()
  }

  getLinks = async (): Promise<GameLink[]> => {
    return await this.storage.getLinks()
  }

  getClanPlayers = async (): Promise<ClanPlayer[]> => {
    const players = await this.getPlayers()
    return players.filter((player): player is ClanPlayer => player.clanName !== undefined)
  }

  getTeams = async (): Promise<Teams> => {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count, level, isQuestionable }) => count > 0 && level > 0 && !isQuestionable)

    return getBalancedTeams(activePlayers)
  }

  getTeamsWithClans = async (): Promise<Teams> => {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count, level, isQuestionable }) => count > 0 && level > 0 && !isQuestionable)

    return sortTeamsByClans(getBalancedTeamsWithClans(activePlayers))
  }

  savePlayer = async (player: UpdatedPlayer): Promise<UpdatedPlayer> => {
    return await this.storage.savePlayer(player)
  }
}
