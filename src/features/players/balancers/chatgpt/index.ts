import { config } from '$/config'
import { FeatureUnavailableError } from '$/errors/FeatureUnavailableError'
import { ITeamBalancer } from '../../types'

import { ChatGptTeamBalancer } from './ChatGptTeamBalancer'
import { GoogleTableSkillsRepository } from './GoogleTableSkillsRepository'
import { ISkillsRepository } from './types'

export const getChatGptBalancer = async (): Promise<ITeamBalancer> => {
  if (config.OPENAI_API_KEY === undefined) {
    throw new FeatureUnavailableError()
  }

  const skillsRepository = getSkillsRepository()

  return new ChatGptTeamBalancer(config.CHATGPT_MODEL, config.OPENAI_API_KEY, skillsRepository)
}

export const getSkillsRepository = (): ISkillsRepository => {
  if (
    config.GOOGLE_SERVICE_ACCOUNT_EMAIL === undefined ||
    config.GOOGLE_PRIVATE_KEY === undefined ||
    config.SKILLS_DOC_ID === undefined ||
    config.SKILLS_SHEETS_ID === undefined
  ) {
    throw new FeatureUnavailableError()
  }

  return new GoogleTableSkillsRepository({
    email: config.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: config.GOOGLE_PRIVATE_KEY,
    docId: config.SKILLS_DOC_ID,
    sheetsId: config.SKILLS_SHEETS_ID
  })
}
