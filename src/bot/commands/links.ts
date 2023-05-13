import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game, logger } = ctx

  const links = await game.getLinks({ logger })
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
