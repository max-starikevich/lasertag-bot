import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { isCreatorOfHomeChat } = ctx

  if (!isCreatorOfHomeChat) {
    return
  }

  const delaySeconds = 20

  await ctx.reply(`delay start: ${delaySeconds} sec`)

  await new Promise(resolve => setTimeout(() => resolve(true), delaySeconds * 1000))

  await ctx.reply('delay finished')
}

export const delay: Command = {
  name: 'delay',
  handler,
  description: () => 'DELAY_TEST',
  showInMenu: false
}
