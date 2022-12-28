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
  isInTeam: boolean
}

export type Teams = [Player[], Player[]]
