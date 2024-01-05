import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { storage } = ctx

  const links = await storage.getLinks()

  for (const url of links) {
    await ctx.replyWithHTML(`🔗 ${url}`)
  }
}

export const links: Command = {
  name: 'links',
  handler,
  description: lang => lang.LINKS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
