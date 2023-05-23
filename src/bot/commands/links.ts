import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { storage } = ctx

  const links = await storage.getLinks()
  const langLinks = links.filter(link => link.lang === ctx.locale)

  for (const { url, description } of langLinks) {
    await ctx.replyWithHTML(`ℹ️ <b>${description}</b>\n\n🔗 ${url}`)
  }
}

export const links: Command = {
  name: 'links',
  handler,
  description: lang => lang.LINKS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
