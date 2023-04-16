import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { s } from 'react-native-wind'

import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import useSWR from 'swr'

import Button from '@/components/button'
import { InputWithLabel } from '@/components/input'
import ExKeyboardAvoidingView from '@/components/keyboardAvoidingView'
import { SWR_KEY } from '@/constants'
import { getStorageData, setStorageData } from '@/utils/async-storage'

const TopScreen = () => {
  const router = useRouter()
  const { mutate } = useSWR<ImagePicker.ImagePickerAsset>(SWR_KEY.ASSET)
  const [ apiKey, setApiKey ] = useState<string | null>(null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [ 1, 1 ],
      quality: 1,
    })
    if (result.canceled) {
      return
    }
    setStorageData('OPENAI_API_KEY', apiKey)
    mutate(result.assets[0])
    router.push('edit')
  }
  
  useEffect(() => {
    getStorageData<string>('OPENAI_API_KEY').then(setApiKey)
  }, [])

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
          <InputWithLabel
            label="YOUR API KEY"
            value={apiKey || ''}
            onChangeText={setApiKey}
          />
          <Button onPress={pickImage}>Select Image</Button>
        </View>
      </View>
    </ExKeyboardAvoidingView>
  )
}

export default TopScreen
