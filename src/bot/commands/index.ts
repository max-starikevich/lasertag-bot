import { start, help } from './help'
import { players } from './players'
import { oldTeams } from './oldteams'
import { teams } from './teams'
import { clans } from './clans'
import { register } from './register'
import { language } from './language'
import { unregister } from './unregister'
import { about } from './about'

import { Command } from '../types'

export const commands: Command[] = [
  start,
  players,
  teams,
  oldTeams,
  clans,
  register,
  unregister,
  language,
  about,
  help
]
