import type { MappedTranslation } from '../i18n-custom'

const by: MappedTranslation = {
  ABOUT_PROJECT_NAME: 'Тэлеграм-бот для лазертага',
  ABOUT_VERSION: 'Версія',
  ABOUT_AUTHOR: 'Аўтар',
  ABOUT_SOURCE_CODE: 'Зыходны код',
  ABOUT_COMMAND_DESCRIPTION: 'Інфармацыя аб боце',

  CLANS_COMMAND_DESCRIPTION: 'Інфармацыя аб кланах',

  HELP_COMMAND_DESCRIPTION: 'Паказаць даступныя каманды',
  HELP_TITLE: 'Даступныя каманды',

  PLAYERS_COMMAND_DESCRIPTION: 'Спіс гульцоў, якія запісаліся',

  OLD_TEAMS_COMMAND_DESCRIPTION: 'Стварыць каманды без кланаў',

  TEAMS_COMMAND_DESCRIPTION: 'Стварыць каманды з кланамі',

  REGISTER_COMMAND_DESCRIPTION: 'Дадаць сябе ў базу дадзеных бота',
  REGISTER_CHOOSE_YOURSELF: 'Выберыце сваё імя са спісу',
  REGISTER_SUCCESS: '{name:string}, вы пасьпяхова зарэгістраваны',
  REGISTER_ALREADY_REGISTERED: 'Вы ўжо зарэгістраваны',
  REGISTER_NO_FREE_ROWS: 'Усе гульцы ўжо зарэгістраваны. Няма свабодных радкоў у табліцы.',
  REGISTER_REQUIRED: 'Для гэтай функцыі патрабуецца рэгістрацыя. Выкарыстоўвайце /{registerCommandName:string}, каб працягнуць.',

  LANGUAGE_COMMAND_DESCRIPTION: 'Выбраць мову',
  LANGUAGE_CHOOSE: 'Выберыце мову',
  LANGUAGE_CHOOSE_SUCCESS: 'Мова выбрана пасьпяхова',

  UNREGISTER_COMMAND_DESCRIPTION: 'Выдаліць сябе з базы дадзеных боту',
  UNREGISTER_SUCCESS: 'Вы пасьпяхова выдалены з базы боту',

  LINKS_COMMAND_DESCRIPTION: 'Карысныя спасылкі',

  ENROLL_COMMAND_DESCRIPTION: 'Запісацца ў файл',
  ENROLL_COMMAND_SUCCESS: 'Вы пасьпяхова запісаны ў файл',

  TEAMS_BALANCE: 'Баланс каманд',
  RECORDED: 'Запісана',
  RENT: 'Патрэбны пракат',
  COUNT: 'Колькасць',
  STATS_WHO_WON: 'Якая каманда перамагла?',
  STATS_SAVE_SUCCESS: 'Статыстыка захавана',
  STATS_SAVE_APPROVED: 'Ваш запыт адобраны адміністратарам. Статыстыка захавана',
  STATS_SEND_TO_ADMIN: 'Так, даслаць адмінам',
  STATS_SEND_TO_ADMIN_OFFER: 'Ужо адыгралі гэтымі складамі?',
  STATS_SENT_SUCCESS: 'Статыстыка адпраўлена адміністратару',
  STATS_SAVE_REQUEST: 'Новы запыт на захаваньне статыстыкі\n\n{username: string}',
  STATS_DRAW: 'Нічыя',
  STATS_NON_EXISTENT: 'Дадзеныя для гэтай гульні ўжо страчаны',

  RENT_NOT_NEEDED: 'Не патрэбен',
  ABSENT: 'Мяне не будзе',

  UNEXPECTED_ERROR_FOR_USER: 'Нечаканая памылка. Паўтарыце запыт пазьней',
  UNKNOWN_COMMAND: 'Не ўдалося распазнаць каманду. Выкарыстоўвайце меню ці каманду /{helpCommandName:string}',
  ACCESS_DENIED: 'Няма доступу',
  SHEETS_ERROR: 'Нешта здарылася з Google-дакументам. Паўтарыце запыт пазьней',
  GROUP_CHAT_WARNING: '✍️ Пішыце мне сюды: @{botUsername:string}',

  ACTION_HANDLER_WRONG_DATA: 'Уведзены няправільныя дадзеныя',

  NOT_ENOUGH_PLAYERS: 'Недастаткова гульцоў для гэтай функцыі',

  PLEASE_WAIT: 'Пачакайце, калі ласка',

  ME_COMMAND_DESCRIPTION: 'Паказаць усю інфармацыю пра мяне',
  ME_WINS: 'Перамогі',
  ME_LOSSES: 'Паразы',
  ME_DRAWS: 'Нічыя',
  ME_GAME_COUNT: 'Усяго гульняў',
  ME_WINRATE: 'Вінрэйт'
}

export default by
