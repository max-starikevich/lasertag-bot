import { ArbitraryPlayer, AiBalancedTeams } from '../types'

export interface AiBalancerService {
  balance: (players: ArbitraryPlayer[]) => Promise<AiBalancedTeams>
}

export const aiTeamBalanceResponseTemplate: AiBalancedTeams = [
  {
    skills: { skill1: 'value', skill2: 'value', skill3: 'value' },
    players: [
      { Name: 'Player1', skill1: 'value', skill2: 'value' },
      { Name: 'Player2', skill1: 'value', skill2: 'value', skill3: 'value' },
      { Name: 'Player3', skill1: 'value', skill2: 'value' }
    ]
  },
  {
    skills: { skill1: 'value', skill2: 'value' },
    players: [
      { Name: 'Player4', skill1: 'value', skill2: 'value' },
      { Name: 'Player5', skill1: 'value', skill2: 'value' },
      { Name: 'Player6', skill1: 'value', skill2: 'value' },
      { Name: 'Player7', skill1: 'value', skill2: 'value' }
    ]
  }
]
