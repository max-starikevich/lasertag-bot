import { ITeamBalancer } from '../../types'
import { ClansTeamBalancer } from './ClansTeamBalancer'

export const getClansBalancer = async (): Promise<ITeamBalancer> => {
  return new ClansTeamBalancer()
}
