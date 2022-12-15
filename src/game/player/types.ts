export interface Player {
  name: string
  combinedName: string
  count: number
  rentCount: number
  comment: string
  level: number
  isQuestionable: boolean
  isCompanion: boolean
}

export type Teams = [Player[], Player[]]
