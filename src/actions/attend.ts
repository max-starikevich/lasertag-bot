import { HandledError } from '../errors';
// import { updatePlayerCount } from '../services/tableManager';
import { BotContext } from '../types';

export default async (ctx: BotContext) => {
  // const { sheetsClient } = ctx;

  // if (!sheetsClient) {
  //   throw new Error(`Missing sheetsClient`);
  // }

  const username: string = ctx.from?.username || '';

  if (!username) {
    throw new HandledError('Не удалось прочитать имя пользователя');
  }

  // const [playerCount = 0, weaponsCount = 0] = input
  //   .split('.')
  //   .map((value) => +value || 0);

  // const countRange = process.env.COUNT_RANGE as string;
  // const usernameRange = process.env.USERNAME_RANGE as string;
  // const weaponsRange = process.env.WEAPONS_RANGE as string;

  // await updatePlayerCount({
  //   countRange,
  //   usernameRange,
  //   weaponsRange,
  //   sheetsClient,
  //   username,
  //   playerCount,
  //   weaponsCount
  // });

  return ctx.reply(`OK, ${username}`);
};
