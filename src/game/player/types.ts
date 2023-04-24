export interface Player {
  tableRow: number

  name: string
  combinedName: string
  count: number
  rentCount: number
  comment: string
  level: number
  isQuestionable: boolean
  clanName?: string
  clanEmoji?: string
  isClanMember: boolean
  isAlone: boolean

  locale?: string
  telegramUserId?: number
}

export interface ClanPlayer extends Player {
  clanName: string
}

export type Teams = [Player[], Player[]]
