import OpenAI from 'openai'
import { CompletionCreateParamsBase } from 'openai/resources/completions'

import { parseFirstJson } from '$/utils'
import { AiError } from '$/errors/AiError'

import { PlayerWithSkills, ISkillsRepository, balanceOutputExample, AiBalanceOutput } from './types'
import { ITeamBalancer, Player, Teams } from '../../types'
import { areTwoTeamsTheSame } from '../..'

export class ChatGptTeamBalancer implements ITeamBalancer {
  private readonly client: OpenAI

  constructor (private readonly model: CompletionCreateParamsBase['model'], apiKey: string, private readonly skillsRepository: ISkillsRepository) {
    this.client = new OpenAI({ apiKey })
  }

  private generatePrompt (players: PlayerWithSkills[]): string {
    return `
      Take a look at these ${players.length} Lasertag players in JSON format:

      ${JSON.stringify(players)}

      I need you to balance those players into two teams as even as possible, using your creative approach.
      Keep team sizes equal. One team can be larger than the other by only 1 player.

      Look closely at skill values and analyze how they impact on the Lasertag game.

      Give me a full JSON object with all those Lasertag players in the following format:

      ${JSON.stringify(balanceOutputExample)}
    `
  }

  async balance (players: Player[]): Promise<Teams> {
    const skills = await this.skillsRepository.find(players.map(({ name }) => name))
    const prompt = this.generatePrompt(skills)

    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: this.model,
      n: 1,
      response_format: { type: 'json_object' }
    })

    const rawResponse = response.choices[0].message.content

    const teamsObject = parseFirstJson<AiBalanceOutput>(rawResponse)

    if (teamsObject == null) {
      throw new AiError({
        message: 'Invalid response from ChatGPT. Can\'t parse the JSON',
        prompt,
        rawResponse
      })
    }

    const { team1, team2 } = teamsObject

    const [team1Players, team2Players] = [team1, team2].map((playerNames) =>
      playerNames.reduce<Player[]>((team, playerName) => {
        const player = players.find(({ name }) => name === playerName)

        if (player == null) {
          return team
        }

        return [...team, player]
      }, [])
    )

    if (!areTwoTeamsTheSame([...team1Players, ...team2Players], players)) {
      throw new AiError({
        message: 'Balanced teams don\'t match the source player list',
        prompt,
        rawResponse,
        teams: [team1Players, team2Players]
      })
    }

    return [team1Players, team2Players]
  }
}
