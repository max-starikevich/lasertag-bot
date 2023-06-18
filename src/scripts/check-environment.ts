import 'module-alias/register'

import { makeLogger } from '$/logger'
import { checkEnvironment } from '$/config/check'

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
