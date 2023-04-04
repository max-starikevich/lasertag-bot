import { start, help } from './help'
import { players } from './players'
import { oldTeams } from './oldteams'
import { teams } from './teams'
import { clans } from './clans'
import { register } from './register'
import { about } from './about'

import { Command } from '../types'
import { language } from './language'

export const commands: Command[] = [
  start,
  players,
  teams,
  oldTeams,
  clans,
  register,
  language,
  about,
  help
]
