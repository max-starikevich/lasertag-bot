import dedent from 'dedent-js'

import { escapeHtml } from '$/utils'

import { author, version, repository } from '../../../package.json'
import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  return await ctx.replyWithHTML(dedent`
    <b>Telegram-бот для лазертага</b>

    Версия: ${version}
    
    Автор: ${escapeHtml(author)}
    
    Исходный код: ${repository}
  `)
}

export const about: Command = {
  name: 'about',
  handler,
  description: 'Информация о боте',
  showInMenu: true
}
