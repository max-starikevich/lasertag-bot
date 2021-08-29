import dedent from 'dedent-js';

import { BotContext } from '@/bot';
import { UserError } from '@/errors';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new UserError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);

  if (activePlayers.length === 0) {
    return ctx.reply('Пока что никто не записан');
  }

  const placeAndTime = await getPlaceAndTime(document);

  return ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      Всего записано: ${activePlayers.length}
      Нужен прокат: ${activePlayers.reduce(
        (rentSum, { rentCount }) => rentSum + rentCount,
        0
      )}

      ${activePlayers
        .filter(({ comment }) => comment.length > 0)
        .map(({ name, comment }) => `${name}: "<i>${comment}</i>"`)
        .join('\n')}
    `
  );
};
