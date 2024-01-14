import { updateBotWebhook } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { bot } from '$/lambda'

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    await updateBotWebhook({
      telegram: bot.telegram,
      logger
    })

    logger.info('✅ Updated bot webhook')
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
