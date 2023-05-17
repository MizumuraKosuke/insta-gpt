import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import Toast from '@/components/toast'

const App = () => {
  return (
    <>
      <StatusBar style="light"/>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  )
}

export default gestureHandlerRootHOC(App)
