import { ILogger } from '../logger/types'
import { IPlayer } from './player/types'

export interface IGame {
  refreshData: ({ logger }: { logger: ILogger }) => Promise<void>
  getPlayers: () => Promise<IPlayer[]>
  getPlaceAndTime: () => Promise<string>
  getTeams: () => Promise<[IPlayer[], IPlayer[]]>
}
