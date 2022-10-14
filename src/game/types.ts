import { IPlayer } from './player/types'

export interface IGame {
  refreshData: () => Promise<void>
  getPlayers: () => Promise<IPlayer[]>
  getPlaceAndTime: () => Promise<string>
  createTeams: () => Promise<[IPlayer[], IPlayer[]]>
}
