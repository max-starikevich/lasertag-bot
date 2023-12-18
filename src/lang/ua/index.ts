import type { MappedTranslation } from '../i18n-custom'

const ua: MappedTranslation = {
  ABOUT_PROJECT_NAME: 'Телеграм-бот для лазертагу',
  ABOUT_VERSION: 'Версія',
  ABOUT_AUTHOR: 'Автор',
  ABOUT_SOURCE_CODE: 'Вихідний код',
  ABOUT_COMMAND_DESCRIPTION: 'Інформація про бота',

  CLANS_COMMAND_DESCRIPTION: 'Інформація про клани',
  CLANS_NO_PLAYERS: 'Немає активних кланів на цей момент',

  HELP_COMMAND_DESCRIPTION: 'Показати доступні команди',
  HELP_TITLE: 'Доступні команди',

  PLAYERS_COMMAND_DESCRIPTION: 'Список зареєстрованих гравців',

  OLD_TEAMS_COMMAND_DESCRIPTION: 'Створити команди без кланів',

  TEAMS_COMMAND_DESCRIPTION: 'Створити команди з кланами',

  REGISTER_COMMAND_DESCRIPTION: 'Додати себе до бази даних бота',
  REGISTER_CHOOSE_YOURSELF: 'Виберіть своє ім\'я зі списку. Якщо його немає - зверніться до організатора, щоб він вас додав.',
  REGISTER_SUCCESS: '{name:string}, ви успішно зареєстровані',
  REGISTER_ALREADY_REGISTERED: 'Ви вже зареєстровані',
  REGISTER_NO_FREE_ROWS: 'Всі гравці вже зареєстровані. Немає вільних рядків у таблиці. Зверніться до організатора, щоб вас додати.',
  REGISTER_REQUIRED: 'Для цього функціоналу потрібна реєстрація. Використовуйте /{registerCommandName:string}, щоб продовжити.',

  LANGUAGE_COMMAND_DESCRIPTION: 'Вибрати мову',
  LANGUAGE_CHOOSE: 'Виберіть мову',
  LANGUAGE_CHOOSE_SUCCESS: 'Мову вибрано успішно',

  UNREGISTER_COMMAND_DESCRIPTION: 'Видалити себе з бази даних бота',
  UNREGISTER_SUCCESS: 'Ви успішно видалені з бази бота',

  LINKS_COMMAND_DESCRIPTION: 'Корисні посилання',

  ENROLL_COMMAND_DESCRIPTION: 'Записатися у файл',
  ENROLL_COMMAND_SUCCESS: 'Ви записані успішно',

  TEAMS_BALANCE: 'Баланс команд',
  RECORDED: 'Записано',
  RENT: 'Оренда',
  COUNT: 'Кількість',
  STATS_WHO_WON: 'Яка команда перемогла?',
  STATS_SAVE_SUCCESS: 'Статистика збережена успішно',
  STATS_SAVE_APPROVED: 'Ваш запит схвалений адміністратором. Статистика успішно збережена',
  STATS_SEND_TO_ADMIN: 'Так, відправити адміністраторам',
  STATS_SEND_TO_ADMIN_OFFER: 'Вже зіграли цими складами?',
  STATS_SENT_SUCCESS: 'Статистика відправлена адміністратору',
  STATS_SAVE_REQUEST: 'Запит на збереження статистики від {username: string}',
  STATS_DRAW: 'Нічия',
  STATS_NON_EXISTENT: 'Дані для цієї гри вже втрачені або пошкоджені',
  STATS_ALREADY_SAVED: 'Статистика для цієї гри вже збережена',
  STATS_SAVE_REJECT: 'Відхилити',
  STATS_SAVE_REJECTED: 'Статистика відхилена',
  STATS_SAVE_REJECTED_FOR_USER: 'Ваш запит відхилено адміністратором',

  RENT_NOT_NEEDED: 'Не потрібен',
  ABSENT: 'Мене не буде',

  UNEXPECTED_ERROR_FOR_USER: 'Неочікувана помилка. Повторіть запит пізніше',
  UNKNOWN_COMMAND: 'Не вдалося розпізнати команду. Використовуйте меню або команду /{helpCommandName:string}',
  ACCESS_DENIED: 'Немає доступу',
  SHEETS_ERROR: 'Щось не так з Google-документом. Повторіть запит пізніше',
  GROUP_CHAT_WARNING: '✍️ Пишіть мені в приват тут: @{botUsername:string}',

  ACTION_HANDLER_WRONG_DATA: 'Вказані невірні дані',

  NOT_ENOUGH_PLAYERS: 'Недостатньо гравців для цієї функції',

  PLEASE_WAIT: 'Будь ласка, зачекайте',

  ME_COMMAND_DESCRIPTION: 'Показати всю інформацію про мене',
  ME_WINS: 'Перемоги',
  ME_LOSSES: 'Поразки',
  ME_DRAWS: 'Нічиї',
  ME_GAME_COUNT: 'Всього ігор',
  ME_WINRATE: 'Вінрейт'
}

export default ua
