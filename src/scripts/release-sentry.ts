import axios from 'axios'

import { version } from '../../package.json'

import { makeLogger } from '$/logger'
import { config } from '$/config'

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    const sentryWebhook = config.SENTRY_DEPLOY_WEBHOOK

    if (sentryWebhook === undefined) {
      throw new Error("Sentry Webhook isn't specified")
    }

    await axios.post(sentryWebhook, {
      version
    })

    logger.info(`✅ Created v${version} release in Sentry`)
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
