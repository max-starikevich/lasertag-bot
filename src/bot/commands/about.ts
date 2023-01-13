import dedent from 'dedent-js'

import { escapeHtml } from '$/utils'

import { author, version, repository } from '../../../package.json'
import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  return await ctx.replyWithHTML(dedent`
    <b>${ctx.lang.ABOUT_PROJECT_NAME()}</b>

    ${ctx.lang.ABOUT_VERSION()}: ${version}
    
    ${ctx.lang.ABOUT_AUTHOR()}: ${escapeHtml(author)}
    
    ${ctx.lang.ABOUT_SOURCE_CODE()}: ${repository}
  `)
}

export const about: Command = {
  name: 'about',
  handler,
  description: lang => lang.ABOUT_COMMAND_DESCRIPTION(),
  showInMenu: true
}
