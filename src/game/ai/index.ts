import { AiBalancedTeams } from './types'
import { AiBalancerService } from './balance/types'
import { AiSkillsStorage } from './storage/types'

export class AiSkillBalancer {
  constructor (private readonly balancerService: AiBalancerService, private readonly skillsStorage: AiSkillsStorage) {}

  async balance (names: string[]): Promise<AiBalancedTeams> {
    const players = await this.skillsStorage.find(names)
    return await this.balancerService.balance(players)
  }
}
