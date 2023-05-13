import dedent from 'dedent-js'
import { shuffle } from 'lodash'

import { NotEnoughPlayersError } from '$/errors/NotEnoughPlayersError'

import { Command, CommandHandler } from '../types'
import { replyWithPlaceAndTime, replyWithTeamBalance, replyWithTeamCount } from '.'

const handler: CommandHandler = async (ctx) => {
  await replyWithPlaceAndTime(ctx)

  const { game, update } = ctx

  const [redPlayers, bluePlayers] = await game.getTeams(update.update_id)

  if (redPlayers.length === 0 || bluePlayers.length === 0) {
    throw new NotEnoughPlayersError()
  }

  await replyWithTeamCount(ctx, [redPlayers, bluePlayers])

  if (redPlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${shuffle(redPlayers)
        .map(({ name, clanEmoji }) => `🔴 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  if (bluePlayers.length > 0) {
    await ctx.replyWithHTML(dedent`
      ${shuffle(bluePlayers)
        .map(({ name, clanEmoji }) => `🔵 ${name} ${clanEmoji ?? ''}`)
        .join('\n')}
    `)
  }

  await replyWithTeamBalance(ctx, [redPlayers, bluePlayers])
}

export const oldTeams: Command = {
  name: 'oldteams',
  handler,
  description: lang => lang.OLD_TEAMS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
