import { ITeamBalancer } from '../../types'
import { NoClansTeamBalancer } from './NoClansTeamBalancer'

export const getNoClansBalancer = async (): Promise<ITeamBalancer> => {
  return new NoClansTeamBalancer()
}
