import { BaseLogger } from '../logger/types'
import { Player, Teams } from './player/types'

export interface BaseGame {
  refreshData: ({ logger }: { logger: BaseLogger }) => Promise<void>
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<string>
  getTeams: () => Promise<Teams>
  getTeamsWithClans: () => Promise<Teams>
}
