export enum GameResult {
  RED = 'RED',
  BLUE = 'BLUE',
  DRAW = 'DRAW'
}

export interface GameData {
  id: string
  date: number
  red: string[]
  blue: string[]
  telegramUserId: number
}
