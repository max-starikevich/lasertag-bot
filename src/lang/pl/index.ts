import type { MappedTranslation } from '../i18n-custom'

const pl: MappedTranslation = {
  ABOUT_PROJECT_NAME: 'Bot Telegram dla lasertagu',
  ABOUT_VERSION: 'Wersja',
  ABOUT_AUTHOR: 'Autor',
  ABOUT_SOURCE_CODE: 'Kod źródłowy',
  ABOUT_COMMAND_DESCRIPTION: 'Informacje o bocie',

  CLANS_COMMAND_DESCRIPTION: 'Informacje o klanach',

  HELP_COMMAND_DESCRIPTION: 'Wyświetl dostępne polecenia',
  HELP_TITLE: 'Dostępne polecenia',

  PLAYERS_COMMAND_DESCRIPTION: 'Lista zarejestrowanych graczy',

  OLD_TEAMS_COMMAND_DESCRIPTION: 'Utwórz drużyny bez klanów',

  TEAMS_COMMAND_DESCRIPTION: 'Utwórz drużyny z klanami',

  REGISTER_COMMAND_DESCRIPTION: 'Dodaj się do bazy danych bota',
  REGISTER_CHOOSE_YOURSELF: 'Wybierz swoje imię z listy. Jeśli go brakuje, skontaktuj się z organizatorem, aby Cię dodał.',
  REGISTER_SUCCESS: '{name:string}, zostałeś pomyślnie zarejestrowany',
  REGISTER_ALREADY_REGISTERED: 'Jesteś już zarejestrowany',
  REGISTER_NO_FREE_ROWS: 'Wszyscy gracze są już zarejestrowani. W tabeli nie ma wolnych wierszy. Skontaktuj się z organizatorem w celu dodania.',
  REGISTER_REQUIRED: 'Ta funkcja wymaga rejestracji. Użyj /{registerCommandName:string}, aby kontynuować.',

  LANGUAGE_COMMAND_DESCRIPTION: 'Wybierz język',
  LANGUAGE_CHOOSE: 'Wybierz język',
  LANGUAGE_CHOOSE_SUCCESS: 'Język został pomyślnie wybrany',

  UNREGISTER_COMMAND_DESCRIPTION: 'Usuń się z bazy danych bota',
  UNREGISTER_SUCCESS: 'Zostałeś pomyślnie usunięty z bazy bota',

  LINKS_COMMAND_DESCRIPTION: 'Przydatne linki',

  ENROLL_COMMAND_DESCRIPTION: 'Zarejestruj się w pliku',
  ENROLL_COMMAND_SUCCESS: 'Zostałeś pomyślnie zarejestrowany',

  TEAMS_BALANCE: 'Bilans drużyn',
  RECORDED: 'Zarejestrowano',
  RENT: 'Wynajem',
  COUNT: 'Liczba',
  STATS_WHO_WON: 'Która drużyna wygrała?',
  STATS_SAVE_SUCCESS: 'Statystyki zostały pomyślnie zapisane',
  STATS_SAVE_APPROVED: 'Twój wniosek został zaakceptowany przez administratora. Statystyki zostały pomyślnie zapisane',
  STATS_SEND_TO_ADMIN: 'Tak, wyślij do administratorów',
  STATS_SEND_TO_ADMIN_OFFER: 'Już grałeś tymi składami?',
  STATS_SENT_SUCCESS: 'Statystyki zostały wysłane do administratora',
  STATS_SAVE_REQUEST: 'Prośba o zapisanie statystyk od {username: string}',
  STATS_DRAW: 'Remis',
  STATS_NON_EXISTENT: 'Dane z tej gry są już utracone lub uszkodzone',
  STATS_ALREADY_SAVED: 'Statystyki dla tej gry zostały już zapisane',
  STATS_SAVE_REJECT: 'Odrzuć',
  STATS_SAVE_REJECTED: 'Statystyki zostały odrzucone',
  STATS_SAVE_REJECTED_FOR_USER: 'Twój wniosek został odrzucony przez administratora',

  RENT_NOT_NEEDED: 'Nie jest potrzebny',
  ABSENT: 'Mnie nie będzie',

  UNEXPECTED_ERROR_FOR_USER: 'Nieoczekiwany błąd. Spróbuj ponownie później',
  UNKNOWN_COMMAND: 'Nie udało się rozpoznać polecenia. Użyj menu lub polecenia /{helpCommandName:string}',
  ACCESS_DENIED: 'Brak dostępu',
  SHEETS_ERROR: 'Coś jest nie tak z Google Docs. Spróbuj ponownie później',
  GROUP_CHAT_WARNING: '✍️ Napisz do mnie prywatnie tutaj: @{botUsername:string}',

  ACTION_HANDLER_WRONG_DATA: 'Podano nieprawidłowe dane',

  NOT_ENOUGH_PLAYERS: 'Nie wystarczająca liczba graczy do tej funkcji',

  PLEASE_WAIT: 'Proszę czekać',

  ME_COMMAND_DESCRIPTION: 'Pokaż wszystkie informacje o mnie',
  ME_WINS: 'Zwycięstwa',
  ME_LOSSES: 'Porażki',
  ME_DRAWS: 'Remisy',
  ME_GAME_COUNT: 'Całkowita liczba gier',
  ME_WINRATE: 'Wskaźnik zwycięstw'
}

export default pl
