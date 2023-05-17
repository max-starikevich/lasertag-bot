import { GameStorage } from './storage/types'
import { GameLocation, BaseGame, GameLink } from './types'

import { ClanPlayer, Player, Teams } from './player/types'
import { getBalancedTeams } from './player/balance/no-clans'
import { getBalancedTeamsWithClans } from './player/balance/with-clans'
import { sortTeamsByClans } from './player/balance'

export interface GameConstructorParams {
  storage: GameStorage
}

export class Game implements BaseGame {
  protected storage: GameStorage

  constructor ({ storage }: GameConstructorParams) {
    this.storage = storage
  }

  async getPlayers (): Promise<Player[]> {
    return await this.storage.getPlayers()
  }

  async getClanPlayers (): Promise<ClanPlayer[]> {
    const players = await this.getPlayers()
    return players.filter((player): player is ClanPlayer => player.clanName !== undefined)
  }

  async getTeams (): Promise<Teams> {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count, level, isQuestionableCount }) => count > 0 && level > 0 && !isQuestionableCount)

    return getBalancedTeams(activePlayers)
  }

  async getTeamsWithClans (): Promise<Teams> {
    const players = await this.getPlayers()
    const activePlayers = players.filter(({ count, level, isQuestionableCount }) => count > 0 && level > 0 && !isQuestionableCount)

    return sortTeamsByClans(getBalancedTeamsWithClans(activePlayers))
  }

  async getLocations (): Promise<GameLocation[]> {
    return await this.storage.getLocations()
  }

  async getLinks (): Promise<GameLink[]> {
    return await this.storage.getLinks()
  }

  async savePlayer (name: string, fields: Partial<Player>): Promise<void> {
    return await this.storage.savePlayer(name, fields)
  }

  async saveStats (teams: Teams): Promise<void> {
    return await this.storage.saveStats(teams)
  }
}
