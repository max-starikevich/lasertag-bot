import { shuffle } from 'lodash';
import dedent from 'dedent-js';

import { HandledError } from '@/errors';
import { BotContext } from '@/types';
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
  const randomizedPlayers = shuffle(activePlayers);
  const half = Math.ceil(randomizedPlayers.length / 2);

  const team1 = randomizedPlayers.splice(0, half);
  const team2 = randomizedPlayers.splice(-half);

  team1[0].name += ' ⭐';
  team2[0].name += ' ⭐';

  return ctx.replyWithMarkdown(
    dedent`
      *${placeAndTime}*

      Команда 1 (${team1.length})
      ${team1.map((player) => `- ${player.name}`).join('\n')}

      Команда 2 (${team2.length})
      ${team2.map((player) => `- ${player.name}`).join('\n')}
    `
  );
};
