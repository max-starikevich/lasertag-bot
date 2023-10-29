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
  ENROLL_COMMAND_SUCCESS: 'Вы записаны успешно',

  TEAMS_BALANCE: 'Баланс команд',
  RECORDED: 'Записано',
  RENT: 'Прокат',
  COUNT: 'Количество',
  STATS_WHO_WON: 'Какая команда победила?',
  STATS_SAVE_SUCCESS: 'Статистика сохранена успешно',
  STATS_SAVE_APPROVED: 'Ваш запрос одобрен администратором. Статистика успешно сохранена',
  STATS_SEND_TO_ADMIN: 'Да, отправить администраторам',
  STATS_SEND_TO_ADMIN_OFFER: 'Уже отыграли этими составами?',
  STATS_SENT_SUCCESS: 'Статистика отправлена администратору',
  STATS_SAVE_REQUEST: 'Запрос на сохранение статистики от {username: string}',
  STATS_DRAW: 'Ничья',
  STATS_NON_EXISTENT: 'Данные для этой игры уже потеряны или испорчены',
  STATS_ALREADY_SAVED: 'Статистика для этой игры уже сохранена',
  STATS_SAVE_REJECT: 'Отклонить',
  STATS_SAVE_REJECTED: 'Статистика отклонена',
  STATS_SAVE_REJECTED_FOR_USER: 'Ваш запрос отклонен администратором',

  RENT_NOT_NEEDED: 'Не нужен',
  ABSENT: 'Меня не будет',

  UNEXPECTED_ERROR_FOR_USER: 'Неожиданная ошибка. Повторите запрос позже',
  UNKNOWN_COMMAND: 'Не удалось распознать команду. Используйте меню или команду /{helpCommandName:string}',
  ACCESS_DENIED: 'Нет доступа',
  SHEETS_ERROR: 'Что-то не так с Google-документом. Повторите запрос позже',
  GROUP_CHAT_WARNING: '✍️ Пишите мне в личку тут: @{botUsername:string}',

  ACTION_HANDLER_WRONG_DATA: 'Указаны неверные данные',

  NOT_ENOUGH_PLAYERS: 'Недостаточное игроков для этой функции',

  PLEASE_WAIT: 'Пожалуйста, подождите',

  ME_COMMAND_DESCRIPTION: 'Показать всю информацию обо мне',
  ME_WINS: 'Победы',
  ME_LOSSES: 'Поражения',
  ME_DRAWS: 'Ничьи',
  ME_GAME_COUNT: 'Всего игр',
  ME_WINRATE: 'Винрэйт'
}

export default ru
