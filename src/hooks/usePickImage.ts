import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import useSWR from 'swr'

import { SWR_KEY } from '@/constants'

const usePickImage = () => {
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

  return {
    pickImage,
  }
}

export default usePickImage
