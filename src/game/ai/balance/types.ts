import { ArbitraryPlayer, AiBalancedTeams } from '../types'

export interface AiBalancerService {
  balance: (players: ArbitraryPlayer[]) => Promise<AiBalancedTeams>
}

export const aiTeamBalanceResponseTemplate: AiBalancedTeams = [
  {
    skills: { skill1: 'average-of-each-player', skill2: 'average-of-each-player', skill3: 'average-of-each-player' },
    players: [
      { Name: 'Player1', skill1: 'some-value', skill2: 'some-value' },
      { Name: 'Player2', skill1: 'some-value', skill2: 'some-value', skill3: 'some-value' },
      { Name: 'Player3', skill1: 'some-value', skill2: 'some-value' }
    ]
  },
  {
    skills: { skill1: 'average-of-each-player', skill2: 'average-of-each-player' },
    players: [
      { Name: 'Player4', skill1: 'some-value', skill2: 'some-value' },
      { Name: 'Player5', skill1: 'some-value', skill2: 'some-value' },
      { Name: 'Player6', skill1: 'some-value', skill2: 'some-value' },
      { Name: 'Player7', skill1: 'some-value', skill2: 'some-value' }
    ]
  }
]
