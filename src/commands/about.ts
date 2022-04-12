import dedent from 'dedent-js'

import { author, version, repository } from '../../package.json'
import { escapeHtml } from '$/utils'
import { CommandHandler } from '$/commands'

const handler: CommandHandler = async (ctx) => {
  return await ctx.replyWithHTML(dedent`
    <b>Telegram-бот для лазертага</b>

    Версия: ${version}
    
    Автор: ${escapeHtml(author)}
    
    Исходный код: ${repository}
  `)
}

export default handler
