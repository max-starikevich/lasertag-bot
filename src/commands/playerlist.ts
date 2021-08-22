import dedent from 'dedent-js';

import { BotContext } from '@/types';
import { HandledError } from '@/errors';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new HandledError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);

  if (activePlayers.length < 2) {
    return ctx.reply('Записано меньше двух человек');
  }

  const placeAndTime = await getPlaceAndTime(document);

  return ctx.replyWithHTML(
    dedent`
      <b>${placeAndTime}</b>

      ${activePlayers
        .map(
          ({ name, count }, i) =>
            `${i + 1}) ${name} ${count > 1 ? `[${count}]` : ``}`
        )
        .join('\n')}
    `
  );
};
