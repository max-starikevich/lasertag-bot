export interface IPlayer {
  name: string
  combinedName: string
  count: number
  rentCount: number
  comment: string
  level: number
  isQuestionable: boolean
  isCompanion: boolean
}

export interface IPlayers {
  all: IPlayer[]
  ready: IPlayer[]
  questionable: IPlayer[]
}
