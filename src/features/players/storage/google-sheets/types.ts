import { GoogleSpreadsheetCell } from 'google-spreadsheet'

import { ParsedRange } from '$/utils'

import { Player } from '../../types'

export type GoogleSpreadsheetPlayerCellMap = { [key in keyof Partial<Player>]: GoogleSpreadsheetCell }
export interface GoogleSpreadsheetCellMap { [key: string]: GoogleSpreadsheetCell }

export interface SheetsData { docId: string, sheetsId: string }
export interface PlayersData extends SheetsData {}
export interface GameData extends SheetsData {}
export interface LinksData extends SheetsData {}
export interface StatsData extends SheetsData {
  timezone: string
}

export interface GoogleTableGameStorageParams {
  email: string
  privateKey: string
  players: PlayersData
  game: GameData
  links: LinksData
  stats: StatsData
  enroll: SheetsData & {
    ranges: {
      names: string
      count: string
      rent: string
      comment: string
    }
  }
}

export interface EnrollRangesData {
  names: ParsedRange
  count: ParsedRange
  rent: ParsedRange
  comment: ParsedRange
}

export interface EnrollData extends SheetsData {
  ranges: EnrollRangesData
}

export enum StatsResult {
  WON = 'W',
  LOST = 'L',
  DRAW = 'X'
}

export const STATS_DATE_FORMAT = 'YYYY-MM-DD'
