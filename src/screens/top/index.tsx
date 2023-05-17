import { Text, View } from 'react-native'
import { s } from 'react-native-wind'

import { Image } from 'expo-image'

import Button from '@/components/button'
import ExKeyboardAvoidingView from '@/components/keyboardAvoidingView'
import usePickImage from '@/hooks/usePickImage'

const TopScreen = () => {
  const { pickImage } = usePickImage()

  return (
    <ExKeyboardAvoidingView>
      <View style={s`h-full flex items-center justify-center bg-midnight px-container`}>
        <View>
          <View style={s`flex-col items-center`}>
            <Text style={s`text-2xl text-white pb-4`}>{'It\'s INSTA GPT'}</Text>
            <Text style={s`text-white pb-4`}>{'Innovative smartphone app that can create Instagram posts automatically through ChatGPT!'}</Text>
            <Image
              source={require('@assets/icon.png')}
              style={s`w-56 h-56 mb-4`}
            />
          </View>
          <Button onPress={pickImage}>Select Image</Button>
        </View>
      </View>
    </ExKeyboardAvoidingView>
  )
}

export default TopScreen
