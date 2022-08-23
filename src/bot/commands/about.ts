import dedent from 'dedent-js'

import { author, version, repository } from '../../../package.json'
import { escapeHtml } from '$/utils'
import { BotCommand, BotCommandHandler } from '$/bot/commands'

const handler: BotCommandHandler = async (ctx) => {
  return await ctx.replyWithHTML(dedent`
    <b>Telegram-бот для лазертага</b>

    Версия: ${version}
    
    Автор: ${escapeHtml(author)}
    
    Исходный код: ${repository}
  `)
}

const command: BotCommand = {
  name: 'about',
  handler,
  description: 'Информация о боте',
  showInMenu: true,
  requireDocument: false
}

export default command
