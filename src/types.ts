import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Context } from 'telegraf';

export interface BotContext extends Context {
  document?: GoogleSpreadsheet;
}
