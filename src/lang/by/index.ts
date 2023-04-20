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

  OWN_WEAPON: 'У мяне свая зброя',
  ABSENT: 'Мяне не будзе',

  UNEXPECTED_ERROR_FOR_USER: 'Нечаканая памылка. Паўтарыце запыт пазьней',
  UNKNOWN_COMMAND: 'Не ўдалося распазнаць каманду. Выкарыстоўвайце меню ці каманду /{helpCommandName:string}',
  NO_HOME_CHAT_ACCESS_MESSAGE: 'Няма доступу',
  DOCUMENT_UNAVAILABLE_FOR_USER: 'Дакумент недаступны. Паўтарыце запыт пазьней',
  GROUP_CHAT_WARNING: '✍️ Пішыце мне ў прыват сюды: @{botUsername:string}.\n\nДзякуй вялікі!',

  ACTION_HANDLER_WRONG_DATA: 'Уведзены няправільныя дадзеныя',

  NOT_ENOUGH_PLAYERS: '🤷 Недастаткова гульцоў дзеля гэтай функцыі'
}

export default by
