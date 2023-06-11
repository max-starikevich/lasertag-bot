import dedent from 'dedent-js'

import { Teams } from '$/game/player/types'
import { getAdmins, getFormattedTelegramUserName, getPlayerLang, getPlayerNames, getPlayersByNames } from '$/game/player'
import { generateId } from '$/utils'

import { RegisterRequiredError } from '$/errors/RegisterRequiredError'
import { AccessDeniedError } from '$/errors/AccessDeniedError'

import { Action, ActionHandler, CommandContext } from '../../types'
import { GameData } from './types'
import { replyWithStatsSave, isGameResult, getScoredPlayersByResult } from './utils'
import { getDateByTimestamp } from '$/game/storage/google-table/utils'

export const initializer = async (
  ctx: CommandContext,
  teams: Teams
): Promise<void> => {
  const { lang, store, currentPlayer } = ctx

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

  if (currentPlayer?.isAdmin === true) {
    await replyWithStatsSave(ctx, ctx.from.id, gameData)
    return
  }

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

const sendStatsToAllAdminsHandler: ActionHandler = async ctx => {
  const { lang, store, players, storage } = ctx
  const timezone = storage.getStatsTimezone()

  void ctx.editMessageText(`⏳ ${lang.PLEASE_WAIT()}`)

  if (ctx.from === undefined) {
    throw new Error('Missing "ctx.from"')
  }

  const gameDataId = ctx.match[1]

  const [{ value: gameData }] = await store.get<GameData>([gameDataId])

  if (gameData === null) {
    void ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
    return
  }

  const allAdmins = getAdmins(players)
  const redTeam = getPlayersByNames(players, gameData.red)
  const blueTeam = getPlayersByNames(players, gameData.blue)

  for (const admin of allAdmins) {
    const username = getFormattedTelegramUserName(ctx.from)
    const lang = getPlayerLang(admin)

    await ctx.telegram.sendMessage(admin.telegramUserId, dedent`
      💾 ${lang.STATS_SAVE_REQUEST({ username })}:

      ${redTeam
        .map(({ name, clanEmoji }) => `🔴 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}

      ${blueTeam
        .map(({ name, clanEmoji }) => `🔵 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}

      📅 ${getDateByTimestamp(gameData.date, timezone).format('DD-MM-YYYY')}
    `)

    await replyWithStatsSave(ctx, admin.telegramUserId, gameData)
  }

  await ctx.reply(`👌 ${lang.STATS_SENT_SUCCESS()}`)
}

const saveStatsHandler: ActionHandler = async ctx => {
  const { lang, store, storage, players, currentPlayer } = ctx

  void ctx.editMessageText(`⏳ ${lang.PLEASE_WAIT()}`)

  if (ctx.from === undefined) {
    throw new Error('Missing "ctx.from"')
  }

  if (currentPlayer === undefined) {
    throw new RegisterRequiredError()
  }

  if (!currentPlayer.isAdmin) {
    throw new AccessDeniedError()
  }

  const gameResult = ctx.match[2]

  if (!isGameResult(gameResult)) {
    void ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
    return
  }

  const gameDataId = ctx.match[1]

  const [{ value: gameData }] = await store.get<GameData>([gameDataId])

  if (gameData === null) {
    void ctx.editMessageText(`🤷 ${lang.STATS_NON_EXISTENT()}`)
    return
  }

  const { won, lost, draw } = getScoredPlayersByResult(players, gameData, gameResult)

  await storage.saveStats({
    won, lost, draw, date: gameData.date
  })

  void ctx.editMessageText(`✅ ${lang.STATS_SAVE_SUCCESS()}`)

  if (ctx.from.id !== gameData.telegramUserId) {
    const playerToNotify = players.find(p => p.telegramUserId === gameData.telegramUserId)
    const lang = getPlayerLang(playerToNotify)

    await ctx.telegram.sendMessage(gameData.telegramUserId, `✅ ${lang.STATS_SAVE_APPROVED()}`)
  }
}

export const stats: Action = {
  mapping: {
    '^stats-save-(\\S+)-(\\w+)$': saveStatsHandler,
    '^stats-send-(\\S+)$': sendStatsToAllAdminsHandler
  }
}
