import { start, help } from './help'
import { players } from './players'
import { oldTeams } from './oldteams'
import { teams } from './teams'
import { clans } from './clans'
import { about } from './about'

import { Command } from '../types'

export const commands: Command[] = [
  start,
  players,
  teams,
  clans,
  oldTeams,
  about,
  help
]
