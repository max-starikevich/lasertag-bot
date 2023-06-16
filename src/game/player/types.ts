import { Locales } from '$/lang/i18n-types'

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface Player {
  tableRow: number
  role?: Role
  isAdmin: boolean

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

  wins: number
  losses: number
  draws: number
  gameCount: number
  winRate: number

  clanName?: string
  clanEmoji?: string
  comment?: string
  telegramUserId?: number | null
}

export interface ClanPlayer extends Player {
  clanName: string
}

export interface AdminPlayer extends Player {
  telegramUserId: number
  role: Role.ADMIN
}

export type Teams = [Player[], Player[]]

export interface GameStatsData {
  won: Player[]
  lost: Player[]
  draw: Player[]
  date: number
}
