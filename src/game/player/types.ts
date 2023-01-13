export interface Player {
  name: string
  combinedName: string
  count: number
  rentCount: number
  comment: string
  level: number
  isQuestionable: boolean
  isCompanion: boolean
  clanName?: string
  clanEmoji?: string
  isClanMember: boolean
  isAloneInClan: boolean
}

export interface ClanPlayer extends Player {
  clanName: string
}

export type Teams = [Player[], Player[]]
