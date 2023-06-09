import { getPlayersByNames } from '$/game/player'
import { Player } from '$/game/player/types'

import { CommandContext } from '../../types'
import { GameResult, GameData } from './types'

export const isGameResult = (data?: string): data is GameResult => String(data) in GameResult

export const getScoredPlayersByResult = (players: Player[], gameData: GameData, result: GameResult): { won: Player[], lost: Player[], draw: Player[] } => {
  const red = getPlayersByNames(players, gameData.red)
  const blue = getPlayersByNames(players, gameData.blue)

  switch (result) {
    case GameResult.DRAW: {
      return {
        won: [],
        lost: [],
        draw: [...red, ...blue]
      }
    }
    case GameResult.RED: {
      return {
        won: red,
        lost: blue,
        draw: []
      }
    }
    case GameResult.BLUE: {
      return {
        won: blue,
        lost: red,
        draw: []
      }
    }
  }
}

export const replyWithStatsSave = async (ctx: Pick<CommandContext, 'lang' | 'telegram'>, chatId: number, gameData: GameData): Promise<void> => {
  const { lang } = ctx

  await ctx.telegram.sendMessage(chatId, lang.STATS_WHO_WON(), {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🔴',
          callback_data: `stats-save-${gameData.id}-${GameResult.RED}`
        },
        {
          text: '🔵',
          callback_data: `stats-save-${gameData.id}-${GameResult.BLUE}`
        },
        {
          text: lang.STATS_DRAW(),
          callback_data: `stats-save-${gameData.id}-${GameResult.DRAW}`
        }
      ]]
    }
  })
}
