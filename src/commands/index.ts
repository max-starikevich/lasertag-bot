import { Markup, Telegraf } from 'telegraf';
import { chunk } from 'lodash';

import { AttendHandlerFunction, BotContext } from '@/types';

import help from '@/commands/help';
import players from '@/commands/players';
import teams from '@/commands/teams';
import version from '@/commands/version';

import { HandledError, handleActionError } from '@/errors';
import { logger } from '@/logger';

interface BotCommand {
  command: string;
  handler: AttendHandlerFunction;
  description: string;
  showInMenu: boolean;
}

export const commands: BotCommand[] = [
  {
    command: '/start',
    handler: help,
    description: 'Начало работы с ботом',
    showInMenu: false
  },
  {
    command: '/randomTeams',
    handler: teams,
    description: 'Получить случайные составы команд по файлу записи',
    showInMenu: true
  },
  {
    command: '/playerList',
    handler: players,
    description: 'Список записавшихся игроков в файл',
    showInMenu: true
  },
  {
    command: '/help',
    handler: help,
    description: 'Помощь',
    showInMenu: true
  },
  {
    command: '/version',
    handler: version,
    description: 'Текущая версия',
    showInMenu: false
  }
];

export const commandsInMenu = commands.filter(
  ({ showInMenu }) => showInMenu === true
);

export const menuKeyboard = Markup.keyboard(
  chunk(
    commandsInMenu.map(({ command }) => command),
    3
  )
)
  .oneTime()
  .resize();

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
