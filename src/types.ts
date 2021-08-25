import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Context } from 'telegraf';

export interface BotContext extends Context {
  document?: GoogleSpreadsheet;
}

export interface Player {
  name: string;
  count: number;
  rentCount: number;
  comment: string;
  group: string;
  isLate: boolean;
}
