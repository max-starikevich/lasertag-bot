import { NoClansTeamBalancer } from '$/features/players/balancers/no-clans/NoClansTeamBalancer'
import { ClansTeamBalancer } from '$/features/players/balancers/clans/ClansTeamBalancer'
import { ITeamBalancer } from '$/features/players/types'

export const getNoClansBalancer = async (): Promise<ITeamBalancer> => new NoClansTeamBalancer()
export const getClansBalancer = async (): Promise<ITeamBalancer> => new ClansTeamBalancer()
export const getChatGptBalancer = async (): Promise<ITeamBalancer> => new NoClansTeamBalancer()
