import { unsetCommandsForGroups, updateBotCommands, updateBotCommandsForPlayers } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { bot } from '$/lambda'
import { config } from '$/config'

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    await unsetCommandsForGroups({
      telegram: bot.telegram,
      logger
    })

    await updateBotCommands({
      telegram: bot.telegram,
      logger,
      locale: config.DEFAULT_LOCALE
    })

    const storage = await bot.context.getStorage?.()

    if (storage === undefined) {
      throw new Error('Storage is unavailable')
    }

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
