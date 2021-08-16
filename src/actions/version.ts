import { BotContext } from '@/types';
import config from '@/config';

export default (ctx: BotContext) => {
  return ctx.reply(config.VERSION);
};
