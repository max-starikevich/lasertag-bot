import { BotContext } from '@/types';
import { HandledError } from '@/errors';
import { getActivePlayers, getPlaceAndTime } from '@/sheets';

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new HandledError(`Не удалось прочитать таблицу`);
  }

  const activePlayers = await getActivePlayers(document);
  const placeAndTime = await getPlaceAndTime(document);

  return ctx.reply(`
${placeAndTime}

${activePlayers
  .map(
    (player, index) =>
      `${index + 1}) ${player.name} ${
        player.count > 1 ? `[${player.count}]` : ``
      }`
  )
  .join('\n')}
  `);
};
