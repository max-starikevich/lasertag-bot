import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { Teams } from '$/game/player/types'
import { getPlayerNames } from '$/game/player'
import { generateId } from '$/utils'

import { Action, ActionHandler, CommandContext } from '../types'

interface GameScoreData {
  id: string
  alternativeId: string
  won: string[]
  lost: string[]
}

export const initializer = async (ctx: CommandContext, teams: Teams): Promise<void> => {
  const { currentPlayer, lang, store } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const redWonScoreId = generateId()
  const blueWonScoreId = generateId()

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
        }
      ]]
    }
  })

  const [redNames, blueNames] = teams.map(team => getPlayerNames(team))

  const redWonData: GameScoreData = {
    id: redWonScoreId,
    alternativeId: blueWonScoreId,
    won: redNames,
    lost: blueNames
  }

  const blueWonData: GameScoreData = {
    id: blueWonScoreId,
    alternativeId: redWonScoreId,
    won: blueNames,
    lost: redNames
  }

  await Promise.all([
    store.set(redWonScoreId, redWonData),
    store.set(blueWonScoreId, blueWonData)
  ])
}

const handler: ActionHandler = async ctx => {
  const { currentPlayer, lang, store } = ctx

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  const scoreId = String(ctx.match[1])

  const score = await store.get<GameScoreData>(scoreId)

  if (score === null) {
    await ctx.reply('This score doesn\'t exist')
    return
  }

  const { id, alternativeId } = score

  await ctx.editMessageText(`✅ ${lang.STATS_SAVE_SUCCESS()}`)

  await store.delete(id)
  await store.delete(alternativeId)
}

export const score: Action = {
  mapping: {
    '^score-(\\S+)$': handler
  }
}
