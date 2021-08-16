import { Telegraf } from 'telegraf';

import { AttendHandlerFunction, BotContext } from '@/types';

import help from '@/actions/help';
import teams from '@/actions/teams';
import commands from '@/actions/commands';
import version from '@/actions/version';
import players from '@/actions/players';

import { HandledError, handleActionError } from '@/errors';
import { logger } from '@/logger';

const wrapper = async (handler: AttendHandlerFunction, ctx: BotContext) => {
  try {
    await handler(ctx);
  } catch (e) {
    if (e instanceof HandledError) {
      ctx.reply(`❌ ${e.message}`);
      return;
    }

    ctx.reply(`❌ Неизвестная ошибка`);
    handleActionError(e);
  }
};

interface Action {
  command: string;
  handler: AttendHandlerFunction;
  description: string;
}

export const actions: Action[] = [
  {
    command: '/start',
    handler: help,
    description: 'Начало работы с ботом'
  },
  {
    command: '/teams',
    handler: teams,
    description: 'Получить случайные составы команд по файлу записи'
  },
  {
    command: '/players',
    handler: players,
    description: 'Список записавшихся игроков в файл'
  },
  {
    command: '/help',
    handler: help,
    description: 'Помощь'
  },
  {
    command: '/commands',
    handler: commands,
    description: 'Список доступных команд'
  },
  {
    command: '/version',
    handler: version,
    description: 'Текущая версия'
  }
];

export const setBotActions = async (bot: Telegraf<BotContext>) => {
  actions.map(({ command, handler }) => {
    bot.command(command, async (ctx) => {
      await wrapper(handler, ctx);
      logger.info(`Processed ${command} command`);
    });
  });
};
