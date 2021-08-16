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
}

export const actions: Action[] = [
  {
    command: '/start',
    handler: help
  },
  {
    command: '/teams',
    handler: teams
  },
  {
    command: '/players',
    handler: players
  },
  {
    command: '/help',
    handler: help
  },
  {
    command: '/commands',
    handler: commands
  },
  {
    command: '/version',
    handler: version
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
