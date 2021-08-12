import { HandledError } from '../errors';
import { updatePlayerCount } from '../services/tableManager';
import { BotContext } from '../types';
import config from '../config';

export default async (ctx: BotContext) => {
  const input: string = (ctx.match?.[0] || '').replace('я=', '');

  if (!input) {
    return;
  }

  const { sheetsClient } = ctx;

  if (!sheetsClient) {
    throw new Error(`Missing sheetsClient`);
  }

  const username: string = ctx.from?.username || '';

  if (!username) {
    throw new HandledError('Не удалось прочитать имя пользователя');
  }

  const [playerCount = 0, weaponsCount = 0] = input
    .split('.')
    .map((value) => +value || 0);

  const countRange = config.COUNT_RANGE;
  const usernameRange = config.USERNAME_RANGE;
  const weaponsRange = config.WEAPONS_RANGE;

  await updatePlayerCount({
    countRange,
    usernameRange,
    weaponsRange,
    sheetsClient,
    username,
    playerCount,
    weaponsCount
  });

  return ctx.reply('OK', { reply_to_message_id: ctx.message?.message_id });
};
