export interface AiBalanceOutput {
  team1: {
    players: Skills[]
  }
  team2: {
    players: Skills[]
  }
}

export const balanceOutputExample: AiBalanceOutput = {
  team1: {
    players: [
      { Name: 'string', skill1: 'string', skill2: 'string' },
      { Name: 'string', skill1: 'string', skill2: 'string' },
      { Name: 'string', skill1: 'string', skill2: 'string' },
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

export interface Skills {
  Name: string
  [skillName: string]: string
}

export interface ISkillsRepository {
  find: (ids: string[]) => Promise<Skills[]>
}
