import { ITeamBalancer } from '../../types'
import { ClansTeamBalancer } from './ClansTeamBalancer'

export const clansBalancerFactory = async (): Promise<ITeamBalancer> => {
  return new ClansTeamBalancer()
}
