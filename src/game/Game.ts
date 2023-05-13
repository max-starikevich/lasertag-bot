import NodeCache from 'node-cache'

import { GameStorage } from './storage/types'
import { GameLocation, BaseGame, GameLink, GameGetParams } from './types'

import { ClanPlayer, Player, Teams } from './player/types'
import { getBalancedTeams } from './player/balance/no-clans'
import { getBalancedTeamsWithClans } from './player/balance/with-clans'
import { sortTeamsByClans } from './player/balance'

interface GameConstructorParams {
  storage: GameStorage
}

export class Game implements BaseGame {
  protected storage: GameStorage
  protected cache = new NodeCache({ stdTTL: 120 })

  constructor ({ storage }: GameConstructorParams) {
    this.storage = storage
  }

  getPlayers = async ({ logger }: GameGetParams): Promise<Player[]> => {
    const cacheId = 'players'
    const cachedData = this.cache.get<Player[]>(cacheId)

    if (cachedData !== undefined) {
      // microcaching
      void this.storage.getPlayers()
        .then(players => this.cache.set(cacheId, players))

      logger.info('Fetched players from the cache and updated in the background')

      return cachedData
    }

    const players = await this.storage.getPlayers()

    this.cache.set(cacheId, players)

    logger.info('Fetched players from API')

    return players
  }

  getClanPlayers = async (params: GameGetParams): Promise<ClanPlayer[]> => {
    const players = await this.getPlayers(params)
    return players.filter((player): player is ClanPlayer => player.clanName !== undefined)
  }

  getTeams = async (params: GameGetParams): Promise<Teams> => {
    const players = await this.getPlayers(params)
    const activePlayers = players.filter(({ count, level, isQuestionable }) => count > 0 && level > 0 && !isQuestionable)

    return getBalancedTeams(activePlayers)
  }

  getTeamsWithClans = async (params: GameGetParams): Promise<Teams> => {
    const players = await this.getPlayers(params)
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
