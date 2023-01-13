import { BaseLogger } from '../logger/types'
import { ClanPlayer, Player, Teams } from './player/types'

export interface BaseGame {
  refreshData: ({ logger }: { logger: BaseLogger }) => Promise<void>
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<string>
  getClanPlayers: () => Promise<ClanPlayer[]>
  getTeams: () => Promise<Teams>
  getTeamsWithClans: () => Promise<Teams>
}
