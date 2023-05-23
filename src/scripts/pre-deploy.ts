/* eslint-disable */
import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.production' })

import { makeLogger } from '$/logger'
import { checkEnvironment } from '$/config/check'
/* eslint-enable */

async function run (): Promise<void> {
  const logger = makeLogger()

  try {
    await checkEnvironment()
    logger.info('✅ Environment is OK')
  } catch (e) {
    logger.error(e)
    process.exit(1)
  }
}

void run()
