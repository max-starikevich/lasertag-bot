import { CommandHandler } from '$/commands'

const handler: CommandHandler = async () => {
  throw new Error('Sentry exception')
}

export default handler
