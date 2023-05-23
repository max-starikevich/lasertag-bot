import { Locales } from '$/lang/i18n-types'

export interface Player {
  tableRow: number

  name: string
  combinedName: string
  count: number
  rentCount: number
  level: number
  isQuestionableCount: boolean
  isQuestionableRentCount: boolean
  isClanMember: boolean
  isAlone: boolean
  locale: Locales

  clanName?: string
  clanEmoji?: string
  comment?: string
  telegramUserId?: number | null
}

export interface ClanPlayer extends Player {
  clanName: string
}

export type Teams = [Player[], Player[]]
