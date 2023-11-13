import { unsetCommandsForGroups, updateBotCommands, updateBotCommandsForPlayers } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { botPromise } from '$/lambda'
import { GameStorage } from '$/game/storage/types'
import config from '$/config'
import { checkEnvironment } from '$/config/check'

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    await checkEnvironment()

    const bot = await botPromise

    await unsetCommandsForGroups({
      telegram: bot.telegram,
      logger
    })

    await updateBotCommands({
      telegram: bot.telegram,
      logger,
      locale: config.DEFAULT_LOCALE
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
