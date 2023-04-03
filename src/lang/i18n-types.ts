// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'by'
	| 'en'
	| 'ru'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * T​e​l​e​g​r​a​m​ ​b​o​t​ ​f​o​r​ ​l​a​s​e​r​t​a​g
	 */
	ABOUT_PROJECT_NAME: string
	/**
	 * V​e​r​s​i​o​n
	 */
	ABOUT_VERSION: string
	/**
	 * A​u​t​h​o​r
	 */
	ABOUT_AUTHOR: string
	/**
	 * S​o​u​r​c​e​ ​c​o​d​e
	 */
	ABOUT_SOURCE_CODE: string
	/**
	 * B​o​t​ ​i​n​f​o​r​m​a​t​i​o​n
	 */
	ABOUT_COMMAND_DESCRIPTION: string
	/**
	 * C​l​a​n​ ​i​n​f​o​r​m​a​t​i​o​n
	 */
	CLANS_COMMAND_DESCRIPTION: string
	/**
	 * S​h​o​w​ ​a​v​a​i​l​a​b​l​e​ ​c​o​m​m​a​n​d​s
	 */
	HELP_COMMAND_DESCRIPTION: string
	/**
	 * A​v​a​i​l​a​b​l​e​ ​c​o​m​m​a​n​d​s
	 */
	HELP_TITLE: string
	/**
	 * P​l​a​y​e​r​s​ ​i​n​ ​t​h​e​ ​r​e​c​o​r​d
	 */
	PLAYERS_COMMAND_DESCRIPTION: string
	/**
	 * C​r​e​a​t​e​ ​t​e​a​m​s​ ​w​i​t​h​o​u​t​ ​c​l​a​n​s
	 */
	OLD_TEAMS_COMMAND_DESCRIPTION: string
	/**
	 * C​r​e​a​t​e​ ​t​e​a​m​s​ ​w​i​t​h​ ​c​l​a​n​s
	 */
	TEAMS_COMMAND_DESCRIPTION: string
	/**
	 * R​e​g​i​s​t​e​r
	 */
	REGISTER_COMMAND_DESCRIPTION: string
	/**
	 * T​e​a​m​ ​b​a​l​a​n​c​e
	 */
	TEAMS_BALANCE: string
	/**
	 * R​e​c​o​r​d​e​d
	 */
	RECORDED: string
	/**
	 * R​e​n​t
	 */
	RENT_NEEDED: string
	/**
	 * U​n​e​x​p​e​c​t​e​d​ ​e​r​r​o​r​.​ ​T​r​y​ ​a​g​a​i​n​ ​l​a​t​e​r
	 */
	UNEXPECTED_ERROR_FOR_USER: string
	/**
	 * U​n​k​n​o​w​n​ ​c​o​m​m​a​n​d​.​ ​U​s​e​ ​m​e​n​u​ ​o​r​ ​c​o​m​m​a​n​d​ ​/​{​h​e​l​p​C​o​m​m​a​n​d​N​a​m​e​}
	 * @param {string} helpCommandName
	 */
	UNKNOWN_COMMAND: RequiredParams<'helpCommandName'>
	/**
	 * A​c​c​e​s​s​ ​d​e​n​i​e​d
	 */
	NO_HOME_CHAT_ACCESS_MESSAGE: string
	/**
	 * D​o​c​u​m​e​n​t​ ​i​s​ ​u​n​a​v​a​i​l​a​b​l​e​.​ ​T​r​y​ ​a​g​a​i​n​ ​l​a​t​e​r
	 */
	DOCUMENT_UNAVAILABLE_FOR_USER: string
	/**
	 * ✍​️​ ​S​e​n​d​ ​m​e​ ​a​ ​p​r​i​v​a​t​e​ ​m​e​s​s​a​g​e​,​ ​p​l​e​a​s​e
	 */
	GROUP_CHAT_WARNING: string
	/**
	 * C​h​o​o​s​e​ ​y​o​u​r​ ​n​a​m​e​ ​f​r​o​m​ ​t​h​e​ ​l​i​s​t
	 */
	REGISTER_CHOOSE_YOURSELF: string
	/**
	 * {​n​a​m​e​}​,​ ​y​o​u​ ​h​a​v​e​ ​b​e​e​n​ ​r​e​g​i​s​t​e​r​e​d​ ​s​u​c​c​e​s​s​f​u​l​l​y
	 * @param {string} name
	 */
	REGISTER_SUCCESS: RequiredParams<'name'>
	/**
	 * Y​o​u​ ​a​r​e​ ​a​l​r​e​a​d​y​ ​r​e​g​i​s​t​e​r​e​d
	 */
	REGISTER_ALREADY_REGISTERED: string
	/**
	 * W​r​o​n​g​ ​d​a​t​a​ ​p​r​o​v​i​d​e​d
	 */
	REGISTER_HANDLER_WRONG_DATA: string
	/**
	 * �​�​ ​N​o​t​ ​e​n​o​u​g​h​ ​p​l​a​y​e​r​s​ ​e​n​r​o​l​l​e​d​ ​f​o​r​ ​t​h​i​s​ ​f​u​n​c​t​i​o​n
	 */
	NOT_ENOUGH_PLAYERS_ENROLLED: string
}

export type TranslationFunctions = {
	/**
	 * Telegram bot for lasertag
	 */
	ABOUT_PROJECT_NAME: () => LocalizedString
	/**
	 * Version
	 */
	ABOUT_VERSION: () => LocalizedString
	/**
	 * Author
	 */
	ABOUT_AUTHOR: () => LocalizedString
	/**
	 * Source code
	 */
	ABOUT_SOURCE_CODE: () => LocalizedString
	/**
	 * Bot information
	 */
	ABOUT_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Clan information
	 */
	CLANS_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Show available commands
	 */
	HELP_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Available commands
	 */
	HELP_TITLE: () => LocalizedString
	/**
	 * Players in the record
	 */
	PLAYERS_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Create teams without clans
	 */
	OLD_TEAMS_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Create teams with clans
	 */
	TEAMS_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Register
	 */
	REGISTER_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Team balance
	 */
	TEAMS_BALANCE: () => LocalizedString
	/**
	 * Recorded
	 */
	RECORDED: () => LocalizedString
	/**
	 * Rent
	 */
	RENT_NEEDED: () => LocalizedString
	/**
	 * Unexpected error. Try again later
	 */
	UNEXPECTED_ERROR_FOR_USER: () => LocalizedString
	/**
	 * Unknown command. Use menu or command /{helpCommandName}
	 */
	UNKNOWN_COMMAND: (arg: { helpCommandName: string }) => LocalizedString
	/**
	 * Access denied
	 */
	NO_HOME_CHAT_ACCESS_MESSAGE: () => LocalizedString
	/**
	 * Document is unavailable. Try again later
	 */
	DOCUMENT_UNAVAILABLE_FOR_USER: () => LocalizedString
	/**
	 * ✍️ Send me a private message, please
	 */
	GROUP_CHAT_WARNING: () => LocalizedString
	/**
	 * Choose your name from the list
	 */
	REGISTER_CHOOSE_YOURSELF: () => LocalizedString
	/**
	 * {name}, you have been registered successfully
	 */
	REGISTER_SUCCESS: (arg: { name: string }) => LocalizedString
	/**
	 * You are already registered
	 */
	REGISTER_ALREADY_REGISTERED: () => LocalizedString
	/**
	 * Wrong data provided
	 */
	REGISTER_HANDLER_WRONG_DATA: () => LocalizedString
	/**
	 * 🤷 Not enough players enrolled for this function
	 */
	NOT_ENOUGH_PLAYERS_ENROLLED: () => LocalizedString
}

export type Formatters = {}
