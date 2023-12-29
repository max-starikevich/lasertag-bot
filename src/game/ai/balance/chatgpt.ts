import OpenAI from 'openai'

import { parseFirstJson } from '$/utils'

import { AiBalancerService, aiTeamBalanceResponseTemplate } from './types'
import { ArbitraryPlayer, AiBalancedTeam, AiBalancedTeams } from '../types'
import { AiWrongResponse } from '../../../errors/AiWrongResponse'

export class ChatGptBalancer implements AiBalancerService {
  private readonly client: OpenAI

  constructor (apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async balance (players: ArbitraryPlayer[]): Promise<[AiBalancedTeam, AiBalancedTeam]> {
    const prompt = this.generatePrompt(players)

    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4'
    })

    const rawContent = response.choices[0].message.content

    const parsedResult = parseFirstJson(rawContent)

    this.validateResponse(parsedResult)

    return parsedResult
  }

  private generatePrompt (players: ArbitraryPlayer[]): string {
    let prompt = 'Group these players into two equal teams based on their skills from this JSON:\n\n'

    players.forEach(player => {
      prompt += JSON.stringify(player, null, 2) + ',\n'
    })

    prompt += '\n\nThe algorithm of player distribution is at your discretion.'

    prompt += '\n\nCreate a JSON object like this:\n\n' + JSON.stringify(aiTeamBalanceResponseTemplate, null, 2)

    return prompt
  }

  private validateResponse (response: Partial<AiBalancedTeams>): asserts response is AiBalancedTeams {
    if (!Array.isArray(response)) {
      throw new AiWrongResponse('ChatGPT response structure is invalid: response is not array')
    }

    if (response.length !== 2) {
      throw new AiWrongResponse('ChatGPT response structure is invalid: response array does not have 2 items')
    }

    for (const team of response) {
      if (team == null) {
        throw new AiWrongResponse('ChatGPT response structure is invalid: an item is not a team type')
      }

      if (!Array.isArray(team.players)) {
        throw new AiWrongResponse('ChatGPT response structure is invalid: team.players field should be an array')
      }

      // if (typeof team.skills === 'object') {
      //   throw new AiWrongResponse('ChatGPT response structure is invalid: team.skills field should be an object')
      // }
    }
  }
}
