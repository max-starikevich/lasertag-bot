import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { game } = ctx

  const links = await game.getLinks()
  const langLinks = links.filter(link => link.lang === ctx.locale)

  for (const { url, description } of langLinks) {
    await ctx.reply(`❗ ${description}\n\n🔗 ${url}`)
  }
}

export const links: Command = {
  name: 'links',
  handler,
  description: lang => lang.LINKS_COMMAND_DESCRIPTION(),
  showInMenu: true
}
