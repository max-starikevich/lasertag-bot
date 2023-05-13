import NodeCache from 'node-cache'

import { GameLocation, GameLink } from './types'
import { Player } from './player/types'
import { Game } from './Game'

export class GameWithCache extends Game {
  protected cache = new NodeCache({ stdTTL: 120 })

  async cacheFunction<T>(cacheKey: string | number, getData: () => Promise<T>): Promise<T> {
    const cachedData = this.cache.get<T>(cacheKey)

    if (cachedData !== undefined) {
      void getData().then(players => this.cache.set(cacheKey, players))
      return cachedData
    }

    const freshData = await getData()
    this.cache.set(cacheKey, freshData)

    return freshData
  }

  async getPlayers (): Promise<Player[]> {
    return await this.cacheFunction('getPlayers', super.getPlayers.bind(this))
  }

  async getLocations (): Promise<GameLocation[]> {
    return await this.cacheFunction('getLocations', super.getLocations.bind(this))
  }

  async getLinks (): Promise<GameLink[]> {
    return await this.cacheFunction('getLinks', super.getLinks.bind(this))
  }

  async savePlayer(name: string, fields: Partial<Player>): Promise<void> {
    await super.savePlayer(name, fields)
    this.cache.del('getPlayers')
  }
}
