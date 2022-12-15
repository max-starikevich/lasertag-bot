import { ILogger } from '../logger/types'
import { Player } from './player/types'

export interface IGame {
  refreshData: ({ logger }: { logger: ILogger }) => Promise<void>
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<string>
  getTeams: () => Promise<[Player[], Player[]]>
}
