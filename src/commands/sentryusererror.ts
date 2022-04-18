import { CommandHandler } from '$/commands'
import { UserError } from '$/errors'

const handler: CommandHandler = async () => {
  throw new UserError('Sentry UserError')
}

export default handler
