import {
  CreateChatCompletionResponse,
  CreateChatCompletionRequest,
} from 'openai'

import { OPENAI_API_KEY, OPENAI_HOST } from '@/constants'
import { post } from '@/utils/fetch'

export const sendMessageGPT = async (content: string) => {
  const options: Partial<CreateChatCompletionRequest> = {
    model: 'gpt-4',
    messages: [{ role: 'user', content }],
  }
  const result = await post<CreateChatCompletionResponse>(
    `${OPENAI_HOST}/chat/completions`,
    OPENAI_API_KEY,
    options,
  )
  if ('error' in result) {
    return { error: result.error }
  }
  return result.choices[0]
}
