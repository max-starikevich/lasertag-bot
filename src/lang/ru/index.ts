import type { MappedTranslation } from '../i18n-custom'

const ru: MappedTranslation = {
  ABOUT_PROJECT_NAME: 'Телеграм-бот для лазертага',
  ABOUT_VERSION: 'Версия',
  ABOUT_AUTHOR: 'Автор',
  ABOUT_SOURCE_CODE: 'Исходный код',
  ABOUT_COMMAND_DESCRIPTION: 'Информация о боте',

  CLANS_COMMAND_DESCRIPTION: 'Информация о кланах',

  HELP_COMMAND_DESCRIPTION: 'Показать доступные команды',
  HELP_TITLE: 'Доступные команды',

  PLAYERS_COMMAND_DESCRIPTION: 'Список записавшихся игроков',

  OLD_TEAMS_COMMAND_DESCRIPTION: 'Создать команды без кланов',

  TEAMS_COMMAND_DESCRIPTION: 'Создать команды с кланами',

  REGISTER_COMMAND_DESCRIPTION: 'Добавить себя в базу данных бота',
  REGISTER_CHOOSE_YOURSELF: 'Выберите свое имя из списка',
  REGISTER_SUCCESS: '{name:string}, вы успешно зарегистрированы',
  REGISTER_ALREADY_REGISTERED: 'Вы уже зарегистрированы',
  REGISTER_NO_FREE_ROWS: 'Все игроки уже зарегистрированы. Нет свободных строк в таблице.',
  REGISTER_REQUIRED: 'Для этого функционала требуется регистрация. Используйте /{registerCommandName:string}, чтобы продолжить.',

  LANGUAGE_COMMAND_DESCRIPTION: 'Выбрать язык',
  LANGUAGE_CHOOSE: 'Выберите язык',
  LANGUAGE_CHOOSE_SUCCESS: 'Язык выбран успешно',

  UNREGISTER_COMMAND_DESCRIPTION: 'Удалить себя из базы данных бота',
  UNREGISTER_SUCCESS: 'Вы успешно удалены из базы бота',

  LINKS_COMMAND_DESCRIPTION: 'Полезные ссылки',

  ENROLL_COMMAND_DESCRIPTION: 'Записаться в файл',
  ENROLL_COMMAND_SUCCESS: 'Вы записаны успешно',

  TEAMS_BALANCE: 'Баланс команд',
  RECORDED: 'Записано',
  RENT: 'Прокат',
  COUNT: 'Количество',
  STATS_WHO_WON: 'Вы уже отыграли? Какая команда победила?',
  STATS_SAVE_SUCCESS: 'Статистика сохранена успешно',
  STATS_DRAW: 'Ничья',
  STATS_NON_EXISTENT: 'Данные для этой игры уже потеряны',

  RENT_NOT_NEEDED: 'Не нужен',
  ABSENT: 'Меня не будет',

  UNEXPECTED_ERROR_FOR_USER: 'Неожиданная ошибка. Повторите запрос позже',
  UNKNOWN_COMMAND: 'Не удалось распознать команду. Используйте меню или команду /{helpCommandName:string}',
  NO_HOME_CHAT_ACCESS_MESSAGE: 'Нет доступа',
  DOCUMENT_UNAVAILABLE_FOR_USER: 'Документ недоступен. Повторите запрос позже',
  GROUP_CHAT_WARNING: '✍️ Пишите мне в личку тут: @{botUsername:string}.\n\nСпасибо!',

  ACTION_HANDLER_WRONG_DATA: 'Указаны неверные данные',

  NOT_ENOUGH_PLAYERS: 'Недостаточное игроков для этой функции'
}

export default ru
