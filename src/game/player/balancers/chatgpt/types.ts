export interface AiBalanceOutput {
  team1: string[]
  team2: string[]
}

export const balanceOutputExample: AiBalanceOutput = {
  team1: [
    'playerName',
    'playerName',
    'playerName',
    'playerName',
    'playerName',
    'playerName',
    'playerName',
    'playerName'
  ],
  team2: [
    'playerName',
    'playerName',
    'playerName',
    'playerName',
    'playerName',
    'playerName',
    'playerName'
  ]
}

export interface PlayerWithSkills {
  Name: string
  [skillName: string]: string
}

export interface ISkillsRepository {
  find: (keys: string[]) => Promise<PlayerWithSkills[]>
}
