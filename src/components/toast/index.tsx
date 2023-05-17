import { memo } from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { s } from 'react-native-wind'

import { AnimatePresence, View } from 'moti'
import useSWR from 'swr'

import { SWR_KEY } from '@/constants'

export type IToast = {
  message: string
  isError: boolean
}

const Toast = () => {
  const { data } = useSWR<IToast>(SWR_KEY.TOAST, { fallbackData: { message: '', isError: false }})

  return (
    <AnimatePresence>
      {data?.message && (
        <View
          from={{ opacity: 0, translateY: 100 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 100 }}
          exitTransition={{ type: 'timing', duration: 600 }}
        >
          <SafeAreaView
            edges={[ 'bottom' ]}
            style={[
              s`absolute bottom-0 left-0 right-0 p-4 items-center`,
              data.isError ? s`bg-red-500` : s`bg-green-500`,
              { opacity: 0.9 },
            ]}
          >
            <Text style={s`text-white font-semibold text-lg`}>{data.message}</Text>
          </SafeAreaView>
        </View>
      )}
    </AnimatePresence>
  )
}

export default memo(Toast)
