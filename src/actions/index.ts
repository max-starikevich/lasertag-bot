import { Telegraf } from 'telegraf';

import { AttendHandlerFunction, BotContext } from '@/types';
import { handlerWrapper } from '@/utilities';

import help from '@/actions/help';
import teams from '@/actions/teams';
import commands from '@/actions/commands';
import version from '@/actions/version';

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
    bot.command(command, (ctx) => handlerWrapper(handler, ctx));
  });
};
