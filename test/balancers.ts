import { AvailableTeamBalancers } from '$/bot/types'

import { ClansTeamBalancer } from '$/game/player/balancers/ClansTeamBalancer'
import { NoClansTeamBalancer } from '$/game/player/balancers/NoClansTeamBalancer'

export const getBalancers = (): AvailableTeamBalancers => {
  return {
    noClans: new NoClansTeamBalancer(),
    withClans: new ClansTeamBalancer(),
    chatGpt: new NoClansTeamBalancer()
  }
}
