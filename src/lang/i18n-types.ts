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
	 * A​d​d​ ​y​o​u​r​s​e​l​f​ ​t​o​ ​t​h​e​ ​b​o​t​'​s​ ​d​a​t​a​b​a​s​e
	 */
	REGISTER_COMMAND_DESCRIPTION: string
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
	 * A​l​l​ ​p​l​a​y​e​r​s​ ​h​a​v​e​ ​b​e​e​n​ ​r​e​g​i​s​t​e​r​e​d​ ​a​l​r​e​a​d​y​.​ ​N​o​ ​f​r​e​e​ ​s​l​o​t​s​ ​a​t​ ​t​h​e​ ​m​o​m​e​n​t​.
	 */
	REGISTER_NO_FREE_ROWS: string
	/**
	 * R​e​g​i​s​t​r​a​t​i​o​n​ ​i​s​ ​r​e​q​u​i​r​e​d​ ​f​o​r​ ​t​h​i​s​ ​f​u​n​c​t​i​o​n​a​l​i​t​y​.​ ​U​s​e​ ​/​{​r​e​g​i​s​t​e​r​C​o​m​m​a​n​d​N​a​m​e​}​ ​t​o​ ​p​r​o​c​e​e​d​.
	 * @param {string} registerCommandName
	 */
	REGISTER_REQUIRED: RequiredParams<'registerCommandName'>
	/**
	 * C​h​o​o​s​e​ ​l​a​n​g​u​a​g​e
	 */
	LANGUAGE_COMMAND_DESCRIPTION: string
	/**
	 * C​h​o​o​s​e​ ​l​a​n​g​u​a​g​e
	 */
	LANGUAGE_CHOOSE: string
	/**
	 * L​a​n​g​u​a​g​e​ ​h​a​s​ ​b​e​e​n​ ​s​e​t​ ​s​u​c​c​e​s​s​f​u​l​l​y
	 */
	LANGUAGE_CHOOSE_SUCCESS: string
	/**
	 * R​e​m​o​v​e​ ​y​o​u​r​s​e​l​f​ ​f​r​o​m​ ​b​o​t​'​s​ ​d​a​t​a​b​a​s​e
	 */
	UNREGISTER_COMMAND_DESCRIPTION: string
	/**
	 * Y​o​u​ ​h​a​v​e​ ​b​e​e​n​ ​r​e​m​o​v​e​d​ ​f​r​o​m​ ​t​h​e​ ​d​a​t​a​b​a​s​e​ ​s​u​c​c​e​s​s​f​u​l​l​y
	 */
	UNREGISTER_SUCCESS: string
	/**
	 * S​h​o​w​ ​u​s​e​f​u​l​ ​l​i​n​k​s
	 */
	LINKS_COMMAND_DESCRIPTION: string
	/**
	 * A​d​d​ ​y​o​u​r​s​e​l​f​ ​t​o​ ​t​h​e​ ​p​l​a​y​e​r​ ​l​i​s​t
	 */
	ENROLL_COMMAND_DESCRIPTION: string
	/**
	 * Y​o​u​'​v​e​ ​b​e​e​n​ ​e​n​r​o​l​l​e​d​ ​s​u​c​c​e​s​s​f​u​l​l​y
	 */
	ENROLL_COMMAND_SUCCESS: string
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
	RENT: string
	/**
	 * C​o​u​n​t
	 */
	COUNT: string
	/**
	 * W​h​i​c​h​ ​t​e​a​m​ ​w​o​n​?
	 */
	STATS_WHO_WON: string
	/**
	 * S​t​a​t​s​ ​s​a​v​e​d​ ​s​u​c​c​e​s​s​f​u​l​l​y
	 */
	STATS_SAVE_SUCCESS: string
	/**
	 * Y​o​u​r​ ​r​e​q​u​e​s​t​ ​h​a​s​ ​b​e​e​n​ ​a​p​p​r​o​v​e​d​ ​b​y​ ​a​d​m​i​n​.​ ​S​t​a​t​s​ ​s​a​v​e​d​ ​s​u​c​c​e​s​s​f​u​l​l​y
	 */
	STATS_SAVE_APPROVED: string
	/**
	 * Y​e​s​,​ ​s​e​n​d​ ​t​o​ ​a​d​m​i​n​s
	 */
	STATS_SEND_TO_ADMIN: string
	/**
	 * A​l​r​e​a​d​y​ ​p​l​a​y​e​d​ ​w​i​t​h​ ​t​h​e​s​e​ ​t​e​a​m​s​?
	 */
	STATS_SEND_TO_ADMIN_OFFER: string
	/**
	 * S​t​a​t​s​ ​h​a​v​e​ ​b​e​e​n​ ​s​e​n​t​ ​t​o​ ​a​d​m​i​n
	 */
	STATS_SENT_SUCCESS: string
	/**
	 * I​n​c​o​m​i​n​g​ ​s​t​a​t​s​ ​s​a​v​e​ ​r​e​q​u​e​s​t​ ​f​r​o​m​ ​{​u​s​e​r​n​a​m​e​}
	 * @param {string} username
	 */
	STATS_SAVE_REQUEST: RequiredParams<'username'>
	/**
	 * D​r​a​w
	 */
	STATS_DRAW: string
	/**
	 * D​a​t​a​ ​f​o​r​ ​t​h​i​s​ ​g​a​m​e​ ​i​s​ ​a​l​r​e​a​d​y​ ​l​o​s​t
	 */
	STATS_NON_EXISTENT: string
	/**
	 * N​o​t​ ​n​e​e​d​e​d
	 */
	RENT_NOT_NEEDED: string
	/**
	 * I​'​l​l​ ​b​e​ ​a​b​s​e​n​t
	 */
	ABSENT: string
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
	ACCESS_DENIED: string
	/**
	 * S​o​m​e​t​h​i​n​g​ ​i​s​ ​w​r​o​n​g​ ​w​i​t​h​ ​t​h​e​ ​G​o​o​g​l​e​ ​d​o​c​u​m​e​n​t​.​ ​T​r​y​ ​a​g​a​i​n​ ​l​a​t​e​r
	 */
	SHEETS_ERROR: string
	/**
	 * ✍​️​ ​S​e​n​d​ ​m​e​ ​a​ ​p​r​i​v​a​t​e​ ​m​e​s​s​a​g​e​ ​h​e​r​e​:​ ​@​{​b​o​t​U​s​e​r​n​a​m​e​}​.
	 * @param {string} botUsername
	 */
	GROUP_CHAT_WARNING: RequiredParams<'botUsername'>
	/**
	 * W​r​o​n​g​ ​d​a​t​a​ ​p​r​o​v​i​d​e​d
	 */
	ACTION_HANDLER_WRONG_DATA: string
	/**
	 * N​o​t​ ​e​n​o​u​g​h​ ​p​l​a​y​e​r​s​ ​f​o​r​ ​t​h​i​s​ ​f​u​n​c​t​i​o​n
	 */
	NOT_ENOUGH_PLAYERS: string
	/**
	 * P​l​e​a​s​e​ ​w​a​i​t
	 */
	PLEASE_WAIT: string
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
	 * Add yourself to the bot's database
	 */
	REGISTER_COMMAND_DESCRIPTION: () => LocalizedString
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
	 * All players have been registered already. No free slots at the moment.
	 */
	REGISTER_NO_FREE_ROWS: () => LocalizedString
	/**
	 * Registration is required for this functionality. Use /{registerCommandName} to proceed.
	 */
	REGISTER_REQUIRED: (arg: { registerCommandName: string }) => LocalizedString
	/**
	 * Choose language
	 */
	LANGUAGE_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Choose language
	 */
	LANGUAGE_CHOOSE: () => LocalizedString
	/**
	 * Language has been set successfully
	 */
	LANGUAGE_CHOOSE_SUCCESS: () => LocalizedString
	/**
	 * Remove yourself from bot's database
	 */
	UNREGISTER_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * You have been removed from the database successfully
	 */
	UNREGISTER_SUCCESS: () => LocalizedString
	/**
	 * Show useful links
	 */
	LINKS_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * Add yourself to the player list
	 */
	ENROLL_COMMAND_DESCRIPTION: () => LocalizedString
	/**
	 * You've been enrolled successfully
	 */
	ENROLL_COMMAND_SUCCESS: () => LocalizedString
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
	RENT: () => LocalizedString
	/**
	 * Count
	 */
	COUNT: () => LocalizedString
	/**
	 * Which team won?
	 */
	STATS_WHO_WON: () => LocalizedString
	/**
	 * Stats saved successfully
	 */
	STATS_SAVE_SUCCESS: () => LocalizedString
	/**
	 * Your request has been approved by admin. Stats saved successfully
	 */
	STATS_SAVE_APPROVED: () => LocalizedString
	/**
	 * Yes, send to admins
	 */
	STATS_SEND_TO_ADMIN: () => LocalizedString
	/**
	 * Already played with these teams?
	 */
	STATS_SEND_TO_ADMIN_OFFER: () => LocalizedString
	/**
	 * Stats have been sent to admin
	 */
	STATS_SENT_SUCCESS: () => LocalizedString
	/**
	 * Incoming stats save request from {username}
	 */
	STATS_SAVE_REQUEST: (arg: { username: string }) => LocalizedString
	/**
	 * Draw
	 */
	STATS_DRAW: () => LocalizedString
	/**
	 * Data for this game is already lost
	 */
	STATS_NON_EXISTENT: () => LocalizedString
	/**
	 * Not needed
	 */
	RENT_NOT_NEEDED: () => LocalizedString
	/**
	 * I'll be absent
	 */
	ABSENT: () => LocalizedString
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
	ACCESS_DENIED: () => LocalizedString
	/**
	 * Something is wrong with the Google document. Try again later
	 */
	SHEETS_ERROR: () => LocalizedString
	/**
	 * ✍️ Send me a private message here: @{botUsername}.
	 */
	GROUP_CHAT_WARNING: (arg: { botUsername: string }) => LocalizedString
	/**
	 * Wrong data provided
	 */
	ACTION_HANDLER_WRONG_DATA: () => LocalizedString
	/**
	 * Not enough players for this function
	 */
	NOT_ENOUGH_PLAYERS: () => LocalizedString
	/**
	 * Please wait
	 */
	PLEASE_WAIT: () => LocalizedString
}

export type Formatters = {}
