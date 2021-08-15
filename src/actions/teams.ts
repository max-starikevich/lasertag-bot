import { shuffle } from 'lodash';

import { HandledError } from '@/errors';
import { BotContext } from '@/types';

interface Player {
  name: string;
  count: number;
}

export default async (ctx: BotContext) => {
  const { document } = ctx;

  if (!document) {
    throw new HandledError(`Не удалось прочитать таблицу`);
  }

  await document.loadInfo();

  const sheet = document.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  await sheet.loadCells('A3:D100');

  const activePlayers: Player[] = [];
  const nameIndex = 0;
  const peopleCountIndex = 2;

  for (let rowNumber = 2; rowNumber < 100; rowNumber++) {
    const player = {
      name: sheet.getCell(rowNumber, nameIndex).value?.toString().trim(),
      count: +sheet.getCell(rowNumber, peopleCountIndex).value
    };

    if (player.count === 1) {
      activePlayers.push(player);
    }

    if (player.count > 1) {
      const splitPlayers: Player[] = [];

      for (let i = player.count; i > 0; i--) {
        splitPlayers.push({
          name: `${player.name} [${i}]`,
          count: 1
        });
      }

      activePlayers.push(...splitPlayers);
    }
  }

  const randomizedPlayers = shuffle(activePlayers);
  const half = Math.ceil(randomizedPlayers.length / 2);

  const team1 = randomizedPlayers.splice(0, half);
  const team2 = randomizedPlayers.splice(-half);

  return ctx.reply(`
Команда 1 (${team1.length})
${team1
  .map((player, index) => `- ${index === 0 ? `⭐` : ''} ${player.name}`)
  .join('\n')}

Команда 2 (${team2.length})
${team2
  .map((player, index) => `- ${index === 0 ? `⭐` : ''} ${player.name}`)
  .join('\n')}
  `);
};
