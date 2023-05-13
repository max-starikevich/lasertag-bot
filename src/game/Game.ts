import { GameStorage } from './storage/types'
import { GameLocation, BaseGame, GameLink } from './types'
import { ClanPlayer, Player, Teams } from './player/types'
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

  getPlayers = async (cacheId?: number): Promise<Player[]> => {
    return await this.storage.getPlayers(cacheId)
  }

  getClanPlayers = async (cacheId?: number): Promise<ClanPlayer[]> => {
    const players = await this.getPlayers(cacheId)
    return players.filter((player): player is ClanPlayer => player.clanName !== undefined)
  }

  getTeams = async (cacheId?: number): Promise<Teams> => {
    const players = await this.getPlayers(cacheId)
    const activePlayers = players.filter(({ count, level, isQuestionable }) => count > 0 && level > 0 && !isQuestionable)

    return getBalancedTeams(activePlayers)
  }

  getTeamsWithClans = async (cacheId?: number): Promise<Teams> => {
    const players = await this.getPlayers(cacheId)
    const activePlayers = players.filter(({ count, level, isQuestionable }) => count > 0 && level > 0 && !isQuestionable)

    return sortTeamsByClans(getBalancedTeamsWithClans(activePlayers))
  }

  getPlaceAndTime = async (): Promise<GameLocation[]> => {
    return await this.storage.getPlaceAndTime()
  }

  getLinks = async (): Promise<GameLink[]> => {
    return await this.storage.getLinks()
  }

  savePlayer = async (name: string, fields: Partial<Player>): Promise<void> => {
    await this.storage.savePlayer(name, fields)
  }
}
