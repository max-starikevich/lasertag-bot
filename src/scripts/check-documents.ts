import { checkEnvironment } from '$/config/check'
import { bot } from '$/lambda'

async function run (): Promise<void> {
  try {
    await checkEnvironment()

    console.info(JSON.stringify({
      storage: await bot.context.storage?.loadDebugInfo(),
      store: await bot.context.store?.loadDebugInfo()
    }, null, 2))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

void run()
