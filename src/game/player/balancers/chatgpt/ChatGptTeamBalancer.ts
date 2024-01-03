import OpenAI from 'openai'

import { parseFirstJson } from '$/utils'
import { AiWrongResponse } from '$/errors/AiWrongResponse'

import { Skills, ISkillsRepository, balanceOutputExample, AiBalanceOutput } from './types'
import { ITeamBalancer, Player, Teams } from '../../types'
import { areTwoTeamsTheSame } from '../..'

export class ChatGptTeamBalancer implements ITeamBalancer {
  private readonly client: OpenAI

  constructor (apiKey: string, private readonly skillsRepository: ISkillsRepository) {
    this.client = new OpenAI({ apiKey })
  }

  private generatePrompt (players: Skills[]): string {
    return `
      Take a look at these ${players.length} Lasertag players in JSON format:

      ${JSON.stringify(players)}

      I need you to balance those players into two teams as even as possible, using your creative approach. Take a look at skill names and analyze how they impact on the Lasertag game.

      Generate a JSON object with the following format:

      ${JSON.stringify(balanceOutputExample)}

      Please, don't lose any players while making teams.
    `
  }

  async balance (players: Player[]): Promise<Teams> {
    const skills = await this.skillsRepository.find(players.map(({ name }) => name))
    const prompt = this.generatePrompt(skills)

    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-1106-preview',
      n: 1
    })

    const rawContent = response.choices[0].message.content

    const parsedResult = parseFirstJson<AiBalanceOutput>(rawContent)

    if (parsedResult == null) {
      throw new AiWrongResponse('Invalid response from ChatGPT. Can\'t parse the JSON')
    }

    const { team1, team2 } = parsedResult

    const [team1Players, team2Players] = [team1, team2].map(({ players: skills }) =>
      skills.reduce<Player[]>((team, skills) => {
        const player = players.find(({ name }) => name === skills.Name)

        if (player == null) {
          return team
        }

        return [...team, player]
      }, [])
    )

    if (areTwoTeamsTheSame([...team1Players, ...team2Players], players)) {
      throw new AiWrongResponse('Balanced teams don\'t match the source player list')
    }

    return [team1Players, team2Players]
  }
}
