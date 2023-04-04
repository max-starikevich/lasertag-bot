export interface Player {
  telegramUserId?: number
  tableRow: number
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
  locale?: string
}

export interface ClanPlayer extends Player {
  clanName: string
}

export type Teams = [Player[], Player[]]
