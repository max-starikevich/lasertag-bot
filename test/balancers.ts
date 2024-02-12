import { NoClansTeamBalancer } from '$/features/players/balancers/no-clans/NoClansTeamBalancer'
import { ClansTeamBalancer } from '$/features/players/balancers/clans/ClansTeamBalancer'
import { ITeamBalancer } from '$/features/players/types'

export const noClansBalancerFactory = async (): Promise<ITeamBalancer> => new NoClansTeamBalancer()
export const clansBalancerFactory = async (): Promise<ITeamBalancer> => new ClansTeamBalancer()
export const chatGptBalancerFactory = async (): Promise<ITeamBalancer> => new NoClansTeamBalancer()
