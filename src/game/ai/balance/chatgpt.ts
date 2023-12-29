import OpenAI from 'openai'

import { parseFirstJson } from '$/utils'

import { AiBalancerService, aiTeamBalanceResponseTemplate } from './types'
import { ArbitraryPlayer, AiBalancedTeams } from '../types'

export class ChatGptBalancer implements AiBalancerService {
  private readonly client: OpenAI

  constructor (apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async balance (players: ArbitraryPlayer[]): Promise<AiBalancedTeams> {
    const prompt = this.generatePrompt(players)

    // console.log(prompt)

    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-1106-preview',
      n: 1
    })

    const rawContent = response.choices[0].message.content

    // console.log(rawContent)

    const parsedResult = parseFirstJson(rawContent)

    // console.log(parsedResult)

    return parsedResult
  }

  private generatePrompt (players: ArbitraryPlayer[]): string {
    let prompt = `Take a look at these ${players.length} Lasertag players in JSON format:\n\n`

    prompt += JSON.stringify(players) + '\n\n'

    prompt += 'I need you to balance those players into two teams as even as possible, using your creative approach. Take a look at skill names and analyze how they impact on the Lasertag game.\n\n'

    prompt += 'Generate a JSON object with the following format:\n\n'
    prompt += JSON.stringify(aiTeamBalanceResponseTemplate) + '\n\n'
    prompt += "Please, don't lose any players while making teams."

    return prompt
  }
}
