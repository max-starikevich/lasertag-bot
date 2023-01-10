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
  teamEmoji?: string
  isTeamMember: boolean
  isAloneInTeam: boolean
}

export type Teams = [Player[], Player[]]
