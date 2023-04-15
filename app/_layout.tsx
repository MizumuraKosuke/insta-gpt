import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const App = () => {
  return (
    <>
      <StatusBar style="auto"/>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}

export default gestureHandlerRootHOC(App)
