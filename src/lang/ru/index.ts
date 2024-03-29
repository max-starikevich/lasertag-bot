import type { MappedTranslation } from '../i18n-custom'

const ru: MappedTranslation = {
  ABOUT_PROJECT_NAME: 'Телеграм-бот для лазертага',
  ABOUT_VERSION: 'Версия',
  ABOUT_AUTHOR: 'Автор',
  ABOUT_SOURCE_CODE: 'Исходный код',
  ABOUT_COMMAND_DESCRIPTION: 'Информация о боте',

  CLANS_COMMAND_DESCRIPTION: 'Информация о кланах',
  CLANS_NO_PLAYERS: 'Нет активных кланов в данный момент',

  HELP_COMMAND_DESCRIPTION: 'Показать доступные команды',
  HELP_TITLE: 'Доступные команды',

  PLAYERS_COMMAND_DESCRIPTION: 'Список записавшихся игроков',

  TEAMS_COMMAND_DESCRIPTION: 'Создать команды без кланов',

  CLAN_TEAMS_COMMAND_DESCRIPTION: 'Создать команды с кланами',

  AI_TEAMS_COMMAND_DESCRIPTION: 'Создать команды с помощью искусственного интеллекта (ИИ)',
  AI_TEAMS_ERROR_MESSAGE: 'ИИ не смог должным образом сбалансировать команды. Попробуйте еще раз позже',
  AI_TEAMS_IN_PROGRESS: 'Пожалуйста, подождите. ИИ работает над вашим запросом',

  REGISTER_COMMAND_DESCRIPTION: 'Добавить себя в базу данных бота',
  REGISTER_CHOOSE_YOURSELF: 'Выберите свое имя из списка. Если оно отсутствует - обратитесь к организатору, чтобы он вас добавил.',
  REGISTER_SUCCESS: '{name:string}, вы успешно зарегистрированы',
  REGISTER_ALREADY_REGISTERED: 'Вы уже зарегистрированы',
  REGISTER_NO_FREE_ROWS: 'Все игроки уже зарегистрированы. Нет свободных строк в таблице. Обратитесь к организатору, чтобы вас добавить.',
  REGISTER_REQUIRED: 'Для этого функционала требуется регистрация. Используйте /{registerCommandName:string}, чтобы продолжить.',

  LANGUAGE_COMMAND_DESCRIPTION: 'Выбрать язык',
  LANGUAGE_CHOOSE: 'Выберите язык',
  LANGUAGE_CHOOSE_SUCCESS: 'Язык выбран успешно',

  UNREGISTER_COMMAND_DESCRIPTION: 'Удалить себя из базы данных бота',
  UNREGISTER_SUCCESS: 'Вы успешно удалены из базы бота',

  LINKS_COMMAND_DESCRIPTION: 'Полезные ссылки',

  ENROLL_COMMAND_DESCRIPTION: 'Записаться в файл',

  TEAMS_BALANCE: 'Баланс команд',
  RECORDED: 'Записано',
  RENT: 'Прокат',
  COUNT: 'Количество',
  STATS_WHO_WON: 'Какая команда победила?',
  STATS_SAVE_SUCCESS: 'Статистика сохранена успешно',
  STATS_DRAW: 'Ничья',
  STATS_NON_EXISTENT: 'Данные для этой игры уже потеряны или испорчены',
  STATS_ALREADY_SAVED: 'Статистика для этой игры уже сохранена',

  RENT_NOT_NEEDED: 'Не нужен',
  ABSENT: 'Меня не будет',

  UNEXPECTED_ERROR_FOR_USER: 'Неожиданная ошибка. Повторите запрос позже',
  UNKNOWN_COMMAND: 'Не удалось распознать команду. Используйте меню или команду /{helpCommandName:string}',
  ACCESS_DENIED: 'Нет доступа',
  SHEETS_ERROR: 'Что-то не так с Google-документом. Повторите запрос позже',

  ACTION_HANDLER_WRONG_DATA: 'Указаны неверные данные',

  NOT_ENOUGH_PLAYERS: 'Недостаточное игроков для этой функции',

  PLEASE_WAIT: 'Пожалуйста, подождите',

  ME_COMMAND_DESCRIPTION: 'Показать всю информацию обо мне',
  ME_WINS: 'Победы',
  ME_LOSSES: 'Поражения',
  ME_DRAWS: 'Ничьи',
  ME_GAME_COUNT: 'Всего игр',
  ME_WINRATE: 'Винрэйт',

  FEATURE_UNAVAILABLE: 'Функция сейчас недоступна'
}

export default ru
