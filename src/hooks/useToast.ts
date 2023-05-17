import { useCallback } from 'react'

import useSWR from 'swr'

import { IToast } from '@/components/toast'
import { SWR_KEY } from '@/constants'

const useToast = () => {
  const { mutate } = useSWR<IToast>(SWR_KEY.TOAST)

  const showToast = useCallback(async (message: string, isError = false) => {
    mutate({
      message,
      isError,
    })
    await new Promise((resolve) => setTimeout(resolve, 3000))
    mutate({
      message: '',
      isError: false,
    })
  }, [ mutate ])

  return { showToast }
}

export default useToast
