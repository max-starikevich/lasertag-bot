export interface Player {
  name: string
  combinedName: string
  count: number
  rentCount: number
  comment: string
  level: number
  isQuestionable: boolean
  isCompanion: boolean
  teamName?: string
  isTeamMember: boolean
  isAloneInTeam: boolean
}

export type Teams = [Player[], Player[]]

export type TeamsWithLevelDifference = [Player[], Player[], number]
