import { Context } from 'telegraf'
import { Update, Message } from 'telegraf/typings/core/types/typegram'
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types'

import { reportException } from '$/errors'

export class CustomContext extends Context {
  /*
  Some messages are gonna be re-tried after they failed in the middle of handler.
  In this case, if some messages were already edited, Telegram API will respond with 400 and break everything.

  So we need to ignore those exceptions, but log them.
  */
  public async editMessageText (text: string, extra?: ExtraEditMessageText): Promise<true | (Update.Edited & Message.TextMessage)> {
    try {
      return await super.editMessageText(text, extra)
    } catch (e) {
      reportException(e)
      return true
    }
  }
}
