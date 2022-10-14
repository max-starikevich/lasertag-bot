import { Context } from 'telegraf'
import { IGame } from '../game/types'

export interface GameContext extends Context {
  game: IGame
}

export type CommandHandler = (ctx: GameContext) => Promise<any>

export interface Command {
  name: string
  handler: CommandHandler
  description: string
  showInMenu: boolean
  requireDocument: boolean
}
