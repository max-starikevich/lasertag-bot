import { start, help } from './help'
import { players } from './players'
import { teams } from './teams'
import { about } from './about'

import { Command } from '../types'

export const enabledCommands: Command[] = [
  start,
  players,
  teams,
  help,
  about
]
