import { ArbitraryPlayer, AiBalancedTeams } from '../types'

export interface AiBalancerService {
  balance: (players: ArbitraryPlayer[]) => Promise<AiBalancedTeams>
}

export const aiTeamBalanceResponseTemplate: AiBalancedTeams = {
  team1: {
    players: [
      { Name: 'string', skill1: 'string', skill2: 'string' },
      { Name: 'string', skill1: 'string', skill2: 'string', skill3: 'string' },
      { Name: 'string', skill1: 'string', skill2: 'string' }
    ]
  },
  team2: {
    players: [
      { Name: 'string', skill1: 'string', skill2: 'string' },
      { Name: 'string', skill1: 'string', skill2: 'string' },
      { Name: 'string', skill1: 'string', skill2: 'string' },
      { Name: 'string', skill1: 'string', skill2: 'string' }
    ]
  }
}
