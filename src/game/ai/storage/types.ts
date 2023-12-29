import { ArbitraryPlayer } from '../types'

export interface AiSkillsStorage {
  find: (keys: string[]) => Promise<ArbitraryPlayer[]>
  findAll: () => Promise<ArbitraryPlayer[]>
}
