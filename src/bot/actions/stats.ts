import dedent from 'dedent-js'
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram'

import { Player, Teams } from '$/game/player/types'
import { getAdmins, getFormattedTelegramUserName, getPlayerNames, getPlayersByNames } from '$/game/player'
import { generateId } from '$/utils'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { AccessDeniedError } from '$/errors/AccessDeniedError'

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
  telegramUserId: number
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
  const { lang, store } = ctx

  const [redNames, blueNames] = teams.map(team => getPlayerNames(team))

  const gameData: GameData = {
    id: generateId(),
    date: Date.now(),
    red: redNames,
    blue: blueNames,
    telegramUserId: ctx.from.id
  }

  await store.set([
    { key: gameData.id, value: gameData }
  ])

  await ctx.reply(lang.STATS_SEND_TO_ADMIN_OFFER(), {
    reply_markup: {
      inline_keyboard: [[
        {
          text: lang.STATS_SEND_TO_ADMIN(),
          callback_data: `stats-send-${gameData.id}`
        }
      ]]
    }
  })
}

const sendStatsHandler: ActionHandler = async ctx => {
  const { lang, store, players } = ctx

  if (ctx.from === undefined) {
    throw new Error('Missing "ctx.from"')
  }

  const gameDataId = ctx.match[1]

  const [{ value: gameData }] = await store.get<GameData>([gameDataId])

  if (gameData === null) {
    return await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
  }

  const allAdmins = getAdmins(players)

  const whoWonButtons: InlineKeyboardMarkup = {
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

  const { red: redTeam, blue: blueTeam } = gameData

  for (const admin of allAdmins) {
    const username = getFormattedTelegramUserName(ctx.from)

    await ctx.telegram.sendMessage(admin.telegramUserId, dedent`
      💾 ${lang.STATS_SAVE_REQUEST({ username })}:

      ${redTeam
        .map(name => `🔴 ${name}`)
        .join('\n')}

      ${blueTeam
        .map(name => `🔵 ${name}`)
        .join('\n')}

      ${lang.STATS_WHO_WON()}
    `, {
      reply_markup: whoWonButtons
    })
  }

  await ctx.editMessageText(`👌 ${lang.STATS_SENT_SUCCESS()}`)
}

const saveStatsHandler: ActionHandler = async ctx => {
  const { lang, store, storage, players, currentPlayer } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  if (!currentPlayer.isAdmin) {
    throw new AccessDeniedError()
  }

  const gameResult = ctx.match[2]

  if (!isGameResult(gameResult)) {
    return await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
  }

  const gameDataId = ctx.match[1]

  const [{ value: gameData }] = await store.get<GameData>([gameDataId])

  if (gameData === null) {
    return await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
  }

  const { won, lost, draw } = getScoredPlayersByResult(players, gameData, gameResult)

  await storage.saveStats({
    won, lost, draw, date: new Date(gameData.date)
  })

  await ctx.editMessageText(`✅ ${lang.STATS_SAVE_SUCCESS()}`)

  await ctx.telegram.sendMessage(gameData.telegramUserId, `✅ ${lang.STATS_SAVE_APPROVED()}`)
}

export const stats: Action = {
  mapping: {
    '^stats-save-(\\S+)-(\\w+)$': saveStatsHandler,
    '^stats-send-(\\S+)$': sendStatsHandler
  }
}
