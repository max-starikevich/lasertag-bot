import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { Teams } from '$/game/player/types'
import { getPlayerNames, getPlayersByNames } from '$/game/player'
import { generateId } from '$/utils'

import { Action, ActionHandler, CommandContext } from '../types'

interface GameScoreData {
  id: string
  connectedIds: string[]
  date: number
  won: string[]
  lost: string[]
  draw: string[]
}

export const initializer = async (ctx: CommandContext, teams: Teams): Promise<void> => {
  const { currentPlayer, lang, store } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const redWonScoreId = generateId()
  const blueWonScoreId = generateId()
  const drawScoreId = generateId()

  const now = Date.now()

  const [redNames, blueNames] = teams.map(team => getPlayerNames(team))

  const redWonData: GameScoreData = {
    id: redWonScoreId,
    connectedIds: [blueWonScoreId, drawScoreId],
    won: redNames,
    lost: blueNames,
    draw: [],
    date: now
  }

  const blueWonData: GameScoreData = {
    id: blueWonScoreId,
    connectedIds: [redWonScoreId, drawScoreId],
    won: blueNames,
    lost: redNames,
    draw: [],
    date: now
  }

  const drawData: GameScoreData = {
    id: drawScoreId,
    connectedIds: [redWonScoreId, blueWonScoreId],
    won: [],
    lost: [],
    draw: [...redNames, ...blueNames],
    date: now
  }

  await store.set(redWonScoreId, redWonData)
  await store.set(blueWonScoreId, blueWonData)
  await store.set(drawScoreId, drawData)

  await ctx.reply(lang.STATS_WHO_WON(), {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🔴',
          callback_data: `score-${redWonScoreId}`
        },
        {
          text: '🔵',
          callback_data: `score-${blueWonScoreId}`
        },
        {
          text: lang.STATS_DRAW(),
          callback_data: `score-${drawScoreId}`
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

  const scoreId = String(ctx.match[1])

  const score = await store.get<GameScoreData>(scoreId)

  if (score === null) {
    await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
    return
  }

  const { id, connectedIds, won, lost, draw, date } = score

  await storage.saveStats({
    won: getPlayersByNames(players, won),
    lost: getPlayersByNames(players, lost),
    draw: getPlayersByNames(players, draw)
  }, new Date(date))

  await ctx.editMessageText(`✅ ${lang.STATS_SAVE_SUCCESS()}`)

  for (const scoreId of [id, ...connectedIds]) {
    await store.delete(scoreId)
  }
}

export const score: Action = {
  mapping: {
    '^score-(\\S+)$': handler
  }
}
