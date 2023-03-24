import { BaseLogger } from '../logger/types'
import { ClanPlayer, Player, Teams } from './player/types'

export interface BaseGame {
  refreshData: ({ logger }: { logger: BaseLogger }) => Promise<void>
  getPlayers: () => Promise<Player[]>
  getClanPlayers: () => Promise<ClanPlayer[]>
  getPlaceAndTime: () => Promise<string>
  getTeams: () => Promise<Teams>
  getTeamsWithClans: () => Promise<Teams>
  registerPlayer: (tableRow: number, userId: number) => Promise<Player>
}
