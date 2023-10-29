import { updateBotWebhook } from '$/bot/webhooks'
import { makeLogger } from '$/logger'
import { botPromise } from '$/lambda'
import { checkEnvironment } from '../config/check'

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    await checkEnvironment()

    const bot = await botPromise

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
