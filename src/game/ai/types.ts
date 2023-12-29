export interface ArbitraryPlayer {
  Name: string
  [skillName: string]: string
}

export interface AiBalancedTeam {
  skills: { [skillName: string]: string }
  players: ArbitraryPlayer[]
}

export type AiBalancedTeams = [AiBalancedTeam, AiBalancedTeam]
