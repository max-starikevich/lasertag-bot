import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Context } from 'telegraf';

export type AttendHandlerFunction = (ctx: BotContext) => Promise<any>;

export interface BotContext extends Context {
  document?: GoogleSpreadsheet;
}

export interface SheetsClient {
  get: (ranges: string[]) => Promise<ValueRange[]>;
  set: (valueRanges: ValueRange[]) => Promise<void>;
}

export interface ValueRange {
  range?: string | null;
  values?: any[][] | null;
}

export interface Player {
  name: string;
  count: number;
}
