import { start, help } from './help'
import { players } from './players'
import { teamsOld } from './teamsOld'
import { teams } from './teams'
import { about } from './about'

import { Command } from '../types'

export const commands: Command[] = [
  start,
  players,
  teams,
  about,
  help,
  teamsOld
]
