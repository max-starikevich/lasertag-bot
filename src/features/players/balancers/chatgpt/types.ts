export interface AiBalanceOutput {
  team1: string[]
  team2: string[]
}

export const balanceOutputExample: AiBalanceOutput = {
  team1: [
    'Emma',
    'Liam',
    'Olivia',
    'Noah',
    'Ava',
    'Ethan',
    'Isabella',
    'Mason'
  ],
  team2: [
    'Sophia',
    'Jacob',
    'Mia',
    'William',
    'Amelia',
    'James',
    'Harper'
  ]
}

export interface PlayerWithSkills {
  Name: string
  [skillName: string]: string
}

export interface ISkillsRepository {
  find: (keys: string[]) => Promise<PlayerWithSkills[]>
}
