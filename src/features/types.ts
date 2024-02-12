import { IKeyValueStore } from './key-value/types'
import { IGameStorage } from './players/storage/types'
import { ITeamBalancer } from './players/types'

export interface FeatureFactories {
  storageFactory: () => Promise<IGameStorage>
  keyValueFactory: () => Promise<IKeyValueStore>
  noClansBalancerFactory: () => Promise<ITeamBalancer>
  clansBalancerFactory: () => Promise<ITeamBalancer>
  chatGptBalancerFactory: () => Promise<ITeamBalancer>
}
