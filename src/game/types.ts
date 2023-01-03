import { BaseLogger } from '../logger/types'
import { Player, TeamsWithLevelDifference } from './player/types'

export interface BaseGame {
  refreshData: ({ logger }: { logger: BaseLogger }) => Promise<void>
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<string>
  getTeams: () => Promise<TeamsWithLevelDifference>
  getTeamsWithClans: () => Promise<TeamsWithLevelDifference>
}
