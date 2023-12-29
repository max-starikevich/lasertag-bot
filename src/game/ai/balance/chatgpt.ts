import axios from 'axios'

import { AiBalancerService, aiTeamBalanceResponseTemplate } from './types'
import { ArbitraryPlayer, AiBalancedTeam, AiBalancedTeams } from '../types'

export class ChatGptBalancer implements AiBalancerService {
  private readonly endpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions'

  constructor (private readonly apiKey: string) {}

  async balance (players: ArbitraryPlayer[]): Promise<[AiBalancedTeam, AiBalancedTeam]> {
    const response = await axios.post(this.endpoint, {
      prompt: this.generatePrompt(players),
      max_tokens: 300
    }, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    const result = JSON.parse(response.data?.choices?.[0]?.text?.trim())

    this.validateResponse(result)

    return result
  }

  private generatePrompt (players: ArbitraryPlayer[]): string {
    let prompt = "Create a JSON object to balance these players into two teams based on their skills. Each team should have a 'skills' summary and a list of 'players' names:\n"

    players.forEach(player => {
      prompt += JSON.stringify(player) + ',\n'
    })

    prompt += 'The JSON object should be structured as follows:\n' + JSON.stringify(aiTeamBalanceResponseTemplate, null, 2)

    return prompt
  }

  private validateResponse (response: Partial<AiBalancedTeams>): asserts response is AiBalancedTeams {
    if (!Array.isArray(response)) {
      throw new Error('ChatGPT response structure is invalid: response is not array')
    }

    if (response.length !== 2) {
      throw new Error('ChatGPT response structure is invalid: response array does not have 2 items')
    }

    for (const team of response) {
      if (team == null) {
        throw new Error('ChatGPT response structure is invalid: an item is not a team type')
      }

      if (!Array.isArray(team.players)) {
        throw new Error('ChatGPT response structure is invalid: team.players field should be an array')
      }

      if (typeof team.skills === 'object') {
        throw new Error('ChatGPT response structure is invalid: team.skills field should be an object')
      }
    }
  }
}

// // Example usage
// const playerBalancer: AiBalancer = new ChatGptBalancer('your-api-key')

// const players: ArbitraryPlayer[] = [
//   { name: 'Alice', speed: '8', durability: '5', accuracy: '7', leadership: '6' }
//   // ... more players with string fields
// ]

// playerBalancer.balance(players)
//   .then(teams => console.log('Team A:', teams.teamA, '\nTeam B:', teams.teamB))
//   .catch(error => console.error('Error:', error))
