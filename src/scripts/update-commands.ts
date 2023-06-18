import 'module-alias/register'

import { updateBotCommands, updateBotCommandsForPlayers } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { defaultLocale } from '$/lang/i18n-custom'
import { botPromise } from '$/lambda'
import { GameStorage } from '$/game/storage/types'

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    const bot = await botPromise

    await updateBotCommands({
      telegram: bot.telegram,
      logger,
      locale: defaultLocale
    })

    const storage = bot.context.storage as GameStorage
    const players = await storage.getPlayers()

    await updateBotCommandsForPlayers({
      telegram: bot.telegram,
      logger
    }, players)

    logger.info('✅ Updated bot commands for registered users')
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
