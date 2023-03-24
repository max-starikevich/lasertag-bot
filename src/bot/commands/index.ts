import { start, help } from './help'
import { players } from './players'
import { oldTeams } from './oldteams'
import { teams } from './teams'
import { clans } from './clans'
import { register } from './register'
import { about } from './about'

import { Command } from '../types'

export const commands: Command[] = [
  start,
  register,
  teams,
  oldTeams,
  players,
  clans,
  about,
  help
]
