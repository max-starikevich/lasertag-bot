import { IPlayer, IPlayers } from './player/types'

export interface IGame {
  refreshData: () => Promise<void>
  getPlayers: () => Promise<IPlayers>
  getPlaceAndTime: () => Promise<string>
  createTeams: () => Promise<[IPlayer[], IPlayer[]]>
}
