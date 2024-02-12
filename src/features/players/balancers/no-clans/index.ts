import { ITeamBalancer } from '../../types'
import { NoClansTeamBalancer } from './NoClansTeamBalancer'

export const noClansBalancerFactory = async (): Promise<ITeamBalancer> => {
  return new NoClansTeamBalancer()
}
