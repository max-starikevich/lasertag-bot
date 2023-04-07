import dedent from 'dedent-js'

import { escapeHtml } from '$/utils'

import { author, version, repository } from '../../../package.json'
import { Command, CommandHandler } from '../types'

const handler: CommandHandler = async (ctx) => {
  const { lang } = ctx

  return await ctx.replyWithHTML(dedent`
    <b>${lang.ABOUT_PROJECT_NAME()}</b>

    ${lang.ABOUT_VERSION()}: ${version}
    
    ${lang.ABOUT_AUTHOR()}: ${escapeHtml(author)}
    
    ${lang.ABOUT_SOURCE_CODE()}: ${repository}
  `)
}

export const about: Command = {
  name: 'about',
  handler,
  description: lang => lang.ABOUT_COMMAND_DESCRIPTION(),
  showInMenu: true
}
