import { Text, View } from 'react-native'
import { s } from 'react-native-wind'

import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import useSWR from 'swr'

import Button from '@/components/button'
import { SWR_KEY } from '@/constants'

const TopScreen = () => {
  const router = useRouter()
  const { mutate } = useSWR<ImagePicker.ImagePickerAsset>(SWR_KEY.ASSET)

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
    mutate(result.assets[0])
    router.push('edit')
  }
  return (
    <View style={s`h-full flex items-center justify-center bg-midnight`}>
      <Text style={s`text-2xl text-white pb-4`}>{'It\'s Insta GPT'}</Text>
      <Button onPress={pickImage}>Select Image</Button>
    </View>
  )
}

export default TopScreen
