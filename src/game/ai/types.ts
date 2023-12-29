export interface ArbitraryPlayer {
  Name: string
  [skillName: string]: string
}

export interface AiBalancedTeam {
  players: ArbitraryPlayer[]
}

export interface AiBalancedTeams {
  team1: AiBalancedTeam
  team2: AiBalancedTeam
}
