import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { Player, Teams } from '$/game/player/types'
import { getPlayerNames, getPlayersByNames } from '$/game/player'
import { generateId } from '$/utils'

import { Action, ActionHandler, CommandContext } from '../types'

enum GameResult {
  RED = 'RED',
  BLUE = 'BLUE',
  DRAW = 'DRAW'
}

const isGameResult = (data?: string): data is GameResult => String(data) in GameResult

interface GameData {
  id: string
  date: number
  red: string[]
  blue: string[]
}

const getScoredPlayersByResult = (players: Player[], gameData: GameData, result: GameResult): { won: Player[], lost: Player[], draw: Player[] } => {
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

export const initializer = async (ctx: CommandContext, teams: Teams): Promise<void> => {
  const { currentPlayer, lang, store } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const [red, blue] = teams.map(team => getPlayerNames(team))

  const gameData: GameData = {
    id: generateId(),
    date: Date.now(),
    red,
    blue
  }

  await store.set([
    { key: gameData.id, value: gameData }
  ])

  await ctx.reply(lang.STATS_WHO_WON(), {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🔴',
          callback_data: `score-${GameResult.RED}-${gameData.id}`
        },
        {
          text: '🔵',
          callback_data: `score-${GameResult.BLUE}-${gameData.id}`
        },
        {
          text: lang.STATS_DRAW(),
          callback_data: `score-${GameResult.DRAW}-${gameData.id}`
        }
      ]]
    }
  })
}

const handler: ActionHandler = async ctx => {
  const { currentPlayer, lang, store, storage, players } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const gameResult = ctx.match[1]

  if (!isGameResult(gameResult)) {
    return await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
  }

  const gameDataId = ctx.match[2]

  const [{ value: gameData }] = await store.get<GameData>([gameDataId])

  if (gameData === null) {
    return await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
  }

  const { won, lost, draw } = getScoredPlayersByResult(players, gameData, gameResult)

  await storage.saveStats({
    won, lost, draw, date: new Date(gameData.date)
  })

  await ctx.editMessageText(`✅ ${lang.STATS_SAVE_SUCCESS()}`)
}

export const score: Action = {
  mapping: {
    '^score-(\\w+)-(\\S+)$': handler
  }
}
