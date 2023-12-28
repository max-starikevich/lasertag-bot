import type { MappedTranslation } from '../i18n-custom'

const by: MappedTranslation = {
  ABOUT_PROJECT_NAME: 'Тэлеграм-бот для лазертагу',
  ABOUT_VERSION: 'Версія',
  ABOUT_AUTHOR: 'Аўтар',
  ABOUT_SOURCE_CODE: 'Зыходны код',
  ABOUT_COMMAND_DESCRIPTION: 'Інфармацыя пра бота',

  CLANS_COMMAND_DESCRIPTION: 'Інфармацыя пра кланы',
  CLANS_NO_PLAYERS: 'Няма актыўных кланаў на гэты момант',

  HELP_COMMAND_DESCRIPTION: 'Паказаць даступныя каманды',
  HELP_TITLE: 'Даступныя каманды',

  PLAYERS_COMMAND_DESCRIPTION: 'Сьпіс гульцоў, якія запісаліся',

  OLD_TEAMS_COMMAND_DESCRIPTION: 'Стварыць каманды без кланаў',

  TEAMS_COMMAND_DESCRIPTION: 'Стварыць каманды зь кланамі',

  REGISTER_COMMAND_DESCRIPTION: 'Дадаць сябе ў базу дадзеных бота',
  REGISTER_CHOOSE_YOURSELF: 'Выберыце сваё імя з файлу запісу. Калі яго няма - зьвярніцеся да арганізатара, каб ён дадаў.',
  REGISTER_SUCCESS: '{name:string}, вы пасьпяхова зарэгістраваны',
  REGISTER_ALREADY_REGISTERED: 'Вы ўжо зарэгістраваны',
  REGISTER_NO_FREE_ROWS: 'Усе гульцы з файла запісу ўжо зарэгістраваны. Няма свабодных радкоў у табліцы. Зьвярніцеся да арганізатара, каб дадаць вас.',
  REGISTER_REQUIRED: 'Для гэтай функцыі патрабуецца рэгістрацыя. Выкарыстоўвайце /{registerCommandName:string}, каб працягнуць.',

  LANGUAGE_COMMAND_DESCRIPTION: 'Выбраць мову',
  LANGUAGE_CHOOSE: 'Выберыце мову',
  LANGUAGE_CHOOSE_SUCCESS: 'Мова выбрана пасьпяхова',

  UNREGISTER_COMMAND_DESCRIPTION: 'Выдаліць сябе з базы дадзеных бота',
  UNREGISTER_SUCCESS: 'Вы пасьпяхова выдалены з базы бота',

  LINKS_COMMAND_DESCRIPTION: 'Карысныя спасылкі',

  ENROLL_COMMAND_DESCRIPTION: 'Запісацца ў файл',

  TEAMS_BALANCE: 'Баланс каманд',
  RECORDED: 'Запісана',
  RENT: 'Патрэбны пракат',
  COUNT: 'Колькасьць',
  STATS_WHO_WON: 'Якая каманда перамогла?',
  STATS_SAVE_SUCCESS: 'Статыстыка захавана',
  STATS_DRAW: 'Нічыя',
  STATS_NON_EXISTENT: 'Дадзеныя для гэтай гульні ўжо страчаны ці сапсаваны',
  STATS_ALREADY_SAVED: 'Статыстыка для гэтай гульні ўжо захавана',

  RENT_NOT_NEEDED: 'Не патрэбен',
  ABSENT: 'Мяне не будзе',

  UNEXPECTED_ERROR_FOR_USER: 'Нечаканая памылка. Паўтарыце запыт пазьней',
  UNKNOWN_COMMAND: 'Не ўдалося распазнаць каманду. Выкарыстоўвайце меню ці каманду /{helpCommandName:string}',
  ACCESS_DENIED: 'Няма доступу',
  SHEETS_ERROR: 'Нешта здарылася зь Google-дакументам. Паўтарыце запыт пазьней',

  ACTION_HANDLER_WRONG_DATA: 'Уведзеныя няправільныя дадзеныя',

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
