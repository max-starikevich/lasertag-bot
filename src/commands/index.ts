import { Telegraf } from 'telegraf';

import { BotContext } from '@/types';
import { HandledError, handleActionError } from '@/errors';
import { logger } from '@/logger';

import help from '@/commands/help';
import playerlist from '@/commands/playerlist';
import randomTeams from '@/commands/randomteams';
import organizerdata from '@/commands/organizerdata';
import about from '@/commands/about';

type AttendHandlerFunction = (ctx: BotContext) => Promise<any>;

interface BotCommand {
  command: string;
  handler: AttendHandlerFunction;
  description: string;
  showInMenu: boolean;
}

const commands: BotCommand[] = [
  {
    command: '/start',
    handler: help,
    description: 'Начало работы с ботом',
    showInMenu: false
  },
  {
    command: '/playerlist',
    handler: playerlist,
    description: 'Список записавшихся игроков в файл',
    showInMenu: true
  },
  {
    command: '/organizerdata',
    handler: organizerdata,
    description: 'Данные для организаторов',
    showInMenu: true
  },
  {
    command: '/randomteams',
    handler: randomTeams,
    description: 'Сделать случайные составы команд по файлу записи',
    showInMenu: true
  },
  {
    command: '/help',
    handler: help,
    description: 'Помощь',
    showInMenu: true
  },
  {
    command: '/about',
    handler: about,
    description: 'Информация о боте',
    showInMenu: true
  }
];

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu === true
);

const wrapper = async (handler: AttendHandlerFunction, ctx: BotContext) => {
  try {
    await handler(ctx);
  } catch (e) {
    if (e instanceof HandledError) {
      ctx.reply(`❌ ${e.message}`);
      return;
    }

    ctx.reply(`❌ Неизвестная ошибка. Попробуйте позже.`);
    handleActionError(e);
  }
};

export const setBotCommands = async (bot: Telegraf<BotContext>) => {
  commands.map(({ command, handler }) => {
    bot.command(command, async (ctx) => {
      await wrapper(handler, ctx);
      logger.info(`Processed ${command} command`);
    });
  });

  bot.hears(/^\/[a-z0-9]+$/i, (ctx) =>
    ctx.reply('Не удалось распознать команду. Попробуйте /help')
  );
};
