import { Telegraf } from 'telegraf';

import { AttendHandlerFunction, BotContext } from '../types';
import { handlerWrapper } from '../utilities';
import help from './help';
import teams from './teams';
import commands from './commands';
import version from './version';

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
