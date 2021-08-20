import { Markup, Telegraf } from 'telegraf';
import { chunk } from 'lodash';

import { BotContext } from '@/types';
import { HandledError, handleActionError } from '@/errors';
import { logger } from '@/logger';

import help from '@/commands/help';
import playerList from '@/commands/playerList';
import randomTeams from '@/commands/randomTeams';
import version from '@/commands/version';

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
    command: '/randomTeams',
    handler: randomTeams,
    description: 'Получить случайные составы команд по файлу записи',
    showInMenu: true
  },
  {
    command: '/playerList',
    handler: playerList,
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
