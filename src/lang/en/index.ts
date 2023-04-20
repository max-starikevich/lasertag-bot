import { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
  ABOUT_PROJECT_NAME: 'Telegram bot for lasertag',
  ABOUT_VERSION: 'Version',
  ABOUT_AUTHOR: 'Author',
  ABOUT_SOURCE_CODE: 'Source code',
  ABOUT_COMMAND_DESCRIPTION: 'Bot information',

  CLANS_COMMAND_DESCRIPTION: 'Clan information',

  HELP_COMMAND_DESCRIPTION: 'Show available commands',
  HELP_TITLE: 'Available commands',

  PLAYERS_COMMAND_DESCRIPTION: 'Players in the record',

  OLD_TEAMS_COMMAND_DESCRIPTION: 'Create teams without clans',

  TEAMS_COMMAND_DESCRIPTION: 'Create teams with clans',

  REGISTER_COMMAND_DESCRIPTION: 'Add yourself to the bot\'s database',
  REGISTER_CHOOSE_YOURSELF: 'Choose your name from the list',
  REGISTER_SUCCESS: '{name:string}, you have been registered successfully',
  REGISTER_ALREADY_REGISTERED: 'You are already registered',
  REGISTER_REQUIRED: 'Registration is required for this functionality. Use /{registerCommandName:string} to proceed.',

  LANGUAGE_COMMAND_DESCRIPTION: 'Choose language',
  LANGUAGE_CHOOSE: 'Choose language',
  LANGUAGE_CHOOSE_SUCCESS: 'Language has been set successfully',

  UNREGISTER_COMMAND_DESCRIPTION: 'Remove yourself from bot\'s database',
  UNREGISTER_SUCCESS: 'You have been removed from the database successfully',

  LINKS_COMMAND_DESCRIPTION: 'Show useful links',

  ENROLL_COMMAND_DESCRIPTION: 'Add yourself to the player list',
  ENROLL_COMMAND_SUCCESS: "You've been enrolled successfully",

  TEAMS_BALANCE: 'Team balance',
  RECORDED: 'Recorded',
  RENT: 'Rent',
  COUNT: 'Count',

  OWN_WEAPON: 'I have my own',
  ABSENT: "I'll be absent",

  UNEXPECTED_ERROR_FOR_USER: 'Unexpected error. Try again later',
  UNKNOWN_COMMAND: 'Unknown command. Use menu or command /{helpCommandName:string}',
  NO_HOME_CHAT_ACCESS_MESSAGE: 'Access denied',
  DOCUMENT_UNAVAILABLE_FOR_USER: 'Document is unavailable. Try again later',
  GROUP_CHAT_WARNING: '✍️ Send me a private message here: @{botUsername:string}.\n\nThanks!',

  ACTION_HANDLER_WRONG_DATA: 'Wrong data provided',

  NOT_ENOUGH_PLAYERS: '🤷 Not enough players for this function'
}

export default en
