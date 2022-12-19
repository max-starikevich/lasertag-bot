import { BaseLogger } from '../logger/types'
import { Player } from './player/types'

export interface BaseGame {
  refreshData: ({ logger }: { logger: BaseLogger }) => Promise<void>
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<string>
  getTeams: () => Promise<[Player[], Player[]]>
}
