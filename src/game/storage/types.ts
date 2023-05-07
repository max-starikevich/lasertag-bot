import { GoogleSpreadsheetCell } from 'google-spreadsheet'

import { ParsedRange } from '$/utils'

import { Player } from '../player/types'
import { GameLink, GameLocation } from '../types'

export interface GameStorage {
  getPlayers: () => Promise<Player[]>
  getPlaceAndTime: () => Promise<GameLocation[]>
  getLinks: () => Promise<GameLink[]>
  savePlayer: (name: string, fields: Partial<Player>) => Promise<void>
}

export type GoogleSpreadsheetCellMap = { [key in keyof Partial<Player>]: GoogleSpreadsheetCell }

export interface SheetsData { docId: string, sheetsId: string }
export interface PlayersData extends SheetsData {}
export interface GameData extends SheetsData {}
export interface LinksData extends SheetsData {}

export interface GoogleTableGameStorageParams {
  email: string
  privateKey: string
  players: PlayersData
  game: GameData
  links: LinksData
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
