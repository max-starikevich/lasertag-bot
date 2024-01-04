import { Teams } from '$/game/player/types'
import { getPlayerNames } from '$/game/player'
import { generateId } from '$/utils'
import { Action, ActionHandler, CommandContext } from '$/bot/types'

import { AccessDeniedError } from '$/errors/AccessDeniedError'

import { GameData } from './types'
import { replyWithStatsSave, isGameResult, getScoredPlayersByResult } from './utils'

export const initializer = async (
  ctx: CommandContext,
  teams: Teams
): Promise<void> => {
  const { isAdminInHomeChat, store } = ctx

  if (!isAdminInHomeChat) {
    return
  }

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

  await replyWithStatsSave(ctx, ctx.from.id, gameData)
}

const saveStatsHandler: ActionHandler = async ctx => {
  const { isAdminInHomeChat, lang, store, storage, players } = ctx

  if (!isAdminInHomeChat) {
    throw new AccessDeniedError()
  }

  const gameDataId = ctx.match[1]

  const [{ value: gameData }] = await store.get<GameData>([gameDataId])

  if (gameData === null) {
    await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
    return
  }

  const gameResult = ctx.match[2]

  if (!isGameResult(gameResult)) {
    await ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
    return
  }

  const { won, lost, draw } = getScoredPlayersByResult(players, gameData, gameResult)

  await storage.saveStats({
    won, lost, draw, date: gameData.date
  })

  await ctx.editMessageText(`✅ ${lang.STATS_SAVE_SUCCESS()}`)
}

export const stats: Action = {
  mapping: {
    '^stats-save-(\\S+)-(\\w+)$': saveStatsHandler
  }
}
