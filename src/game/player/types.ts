export interface Player {
  name: string
  combinedName: string
  teamName: string
  count: number
  rentCount: number
  comment: string
  level: number
  isQuestionable: boolean
  isCompanion: boolean
  isTeamMember: boolean
}

export type Teams = [Player[], Player[]]
