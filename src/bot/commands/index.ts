import { start, help } from './help'
import { players } from './players'
import { teams } from './teams'
import { clans } from './clans'
import { about } from './about'

import { Command } from '../types'

export const commands: Command[] = [
  start,
  players,
  teams,
  clans,
  help,
  about
]
