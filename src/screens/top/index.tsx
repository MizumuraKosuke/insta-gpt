import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { s } from 'react-native-wind'

import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import useSWR from 'swr'

import Button from '@/components/button'
import { InputWithLabel } from '@/components/input'
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
    <View style={s`h-full flex items-center justify-center bg-midnight px-container`}>
      <View>
        <Text style={s`text-2xl text-white pb-4`}>{'It\'s Insta GPT'}</Text>
        <InputWithLabel
          label="GPT API KEY"
          value={apiKey || ''}
          onChangeText={setApiKey}
        />
        <Button onPress={pickImage}>Select Image</Button>
      </View>
    </View>
  )
}

export default TopScreen
