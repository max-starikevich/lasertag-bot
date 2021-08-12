import { Context } from 'telegraf';

import { handleActionError, HandledError } from './errors';
import { AttendHandlerFunction } from './types';

export const handlerWrapper = async (
  handler: AttendHandlerFunction,
  ctx: Context
) => {
  try {
    await handler(ctx);
  } catch (e) {
    if (e instanceof HandledError) {
      ctx.reply(`❌ ${e.message}`);
      return;
    }

    ctx.reply('❌ Внутренняя ошибка системы. Повторите свой запрос позже.');
    handleActionError(e);
  }
};
