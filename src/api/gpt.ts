import {
  CreateChatCompletionResponse,
  CreateChatCompletionRequest,
} from 'openai'

import { OPENAI_HOST, OPENAI_API_KEY } from '@/constants'
import { post } from '@/utils/fetch'


export const sendMessageGPT = async (content: string) => {
  const options: Partial<CreateChatCompletionRequest> = {
    model: 'gpt-3.5-turbo',
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
