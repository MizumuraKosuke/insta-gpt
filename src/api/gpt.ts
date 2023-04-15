import {
  CreateChatCompletionResponse,
  CreateChatCompletionRequest,
} from 'openai'

import { OPENAI_HOST } from '@/constants'
import { getStorageData } from '@/utils/async-storage'
import { post } from '@/utils/fetch'

export const sendMessageGPT = async (content: string) => {
  const apiKey = await getStorageData<string>('OPENAI_API_KEY')
  if (!apiKey) {
    return { error: 'APIキーが設定されていません。' }
  }
  const options: Partial<CreateChatCompletionRequest> = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content }],
  }
  const result = await post<CreateChatCompletionResponse>(
    `${OPENAI_HOST}/chat/completions`,
    apiKey,
    options,
  )
  if ('error' in result) {
    return { error: result.error }
  }
  return result.choices[0]
}
