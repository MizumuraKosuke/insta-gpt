import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Linking, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ViewShot from 'react-native-view-shot'
import { s } from 'react-native-wind'

import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { Image } from 'expo-image'
import { ImagePickerAsset } from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from 'expo-router'
import useSWR from 'swr'

import { sendMessageGPT } from '@/api/gpt'
import Button from '@/components/button'
import { InputWithLabel } from '@/components/input'
import ExKeyboardAvoidingView from '@/components/keyboardAvoidingView'
import Pinch from '@/components/pinch'
import { SWR_KEY } from '@/constants'
import usePickImage from '@/hooks/usePickImage'
import useToast from '@/hooks/useToast'

const prompt = (menu: string, store: string, station: string, description?: string) => {
  return `
  店舗名: ${store}
  料理名: ${menu}
  駅名: ${station}
  店についての説明: ${description || 'なし'}
  以上の情報からグルメのインスタグラマーとして、レストランの食事をインスタグラムに投稿する。
  高いインプレッションを得るための以下の要件に合うよう、JSON形式で答えてください。
  【要件】
  caption: 画像の紹介文。ハッシュタグを含む。文字数は170文字以上。ハッシュタグは日本語と英語を含む合計20個から30個。
  textInImage: 画像内に表示するキャッチコピー。改行ありで2行で25文字以下
  信憑性に欠ける情報は避けてください。

  以下は例です
  {
    "caption": "【吉祥寺で本場のNYローカルフードを🇺🇸】\\n\\n吉祥寺に昨年夏にオープンした「The Daps Famous Hood Joint」。ニューヨークに住んでたというオーナーが作った店の世界観はまさにアメリカそのもの。マジでドープでカッコいい。\\nそんなお店でいただけるのが本場のローカルフード、チキンオーバーライスとサンドイッチ。心ゆくままにジャンクなフードをコーラを片手に食べられる体験はマジで最高。\\nこの最高な体験を東京は吉祥寺で味わえるなんて、、、。\\nメシボーイの世界観が好きなみんなならきっと気にいるはず！\\n是非みんなも行ってみてね✌️\\n#サンドウィッチ  #チキンオーバーライス  #吉祥寺  #吉祥寺グルメ  #吉祥寺ランチ  #吉祥寺ディナー  #東京グルメ  #東京ランチ  #アメリカンフード  #コーラ  #ニューヨーク  #食べログ  #ローカルフード  #アメリカンカフェ  #中央線グルメ  #中央線  #中央線ランチ  #カフェグルメ  #井の頭線グルメ  #井の頭線  #京王線  #京王線グルメ  #武蔵野市  #ハンバーガー  #chickenoverrice  #sandwich  #newyork  #america"",
    "textInImage": "DOPEなローカルフードで\\nNY気分を吉祥寺で味わう"
  }
  `
}

const EditScreen = () => {
  const router = useRouter()
  const { data: asset } = useSWR<ImagePickerAsset>(SWR_KEY.ASSET)
  const ref = useRef<ViewShot>(null)
  const { showToast } = useToast()
  const { pickImage } = usePickImage()

  const [ menu, setMenu ] = useState('')
  const [ store, setStore ] = useState('')
  const [ station, setStation ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ caption, setCaption ] = useState('')
  const [ textInImage, setTextInImage ] = useState('')
  const [ gooleMapLink, setGooleMapLink ] = useState('https://www.google.co.jp/maps/')
  const [ loading, setLoading ] = useState(false)

  const onBack = useCallback(() => {
    Alert.alert(
      'Create another post?',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => router.back(),
        },
        {
          text: 'OK',
          onPress: pickImage,
        },
      ])
  }, [ pickImage, router ])

  const onSave = useCallback(() => {
    if (ref.current?.capture) {
      ref.current.capture().then(async (uri) => {
        const shareOptions = {
          title: 'Share via',
          message: 'Share via',
          url: uri,
        }
        const result = await Share.share(shareOptions)
        if (result.action === Share.sharedAction) {
          const copied = await Clipboard.setStringAsync(caption)
          if (!copied) {
            return
          }
          showToast('Copied to clipboard!')
          onBack()
        }
      })
    }
  }, [ caption, onBack, showToast ])

  const onSubmit = useCallback(async () => {
    setLoading(true)
    const result = await sendMessageGPT(prompt(menu, store, station, description))
    if ('error' in result) {
      Alert.alert('Error', result.error)
      setLoading(false)
      return
    }
    if (!result.message?.content) {
      Alert.alert('Error', 'No response')
      setLoading(false)
      return
    }
    const contents = JSON.parse(result.message?.content)
    setCaption(contents.caption)
    setTextInImage(contents.textInImage)
    setLoading(false)
  }, [ description, menu, station, store ])

  useEffect(() => {
    const getAssetInfo = async () => {
      if (!asset?.assetId) {
        return
      }
      const result = await MediaLibrary.getAssetInfoAsync(asset?.assetId || '')
      setGooleMapLink(
        result.location ? `https://www.google.co.jp/maps/@${result.location?.latitude},${result.location?.longitude},18z` : 'https://www.google.co.jp/maps/',
      )
    }
    getAssetInfo()
    setMenu('')
    setStore('')
    setStation('')
    setDescription('')
    setCaption('')
    setTextInImage('')
  }, [ asset?.assetId ])
 
  return (
    <SafeAreaView style={s`flex-1 bg-midnight`}>
      <ExKeyboardAvoidingView>
        <ScrollView>
          <View style={s`flex-row items-center`}>
            <TouchableOpacity
              onPress={onBack}
              style={s`p-3`}
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={s`flex-1 text-white text-lg text-center mr-12`}>
              {'Generate'}
            </Text>
          </View>
          <View style={s`mb-4 relative`}>
            <ViewShot ref={ref}>
              <View style={[ s`relative w-full`, { aspectRatio: 1 }]}>
                <Image source={{ uri: asset?.uri }} style={s`flex-1`} contentFit="cover" />
                <View style={s`absolute top-5 left-5`}>
                  <Pinch>
                    <Text style={[ s`text-5xl text-white font-bold min-w-80`, { shadowOpacity: 10 }]}>
                      {station}
                    </Text>
                  </Pinch>
                  <Pinch>
                    <Text style={[ s`text-3xl text-white font-bold min-w-80`, { shadowOpacity: 10 }]}>
                      {store}
                    </Text>
                  </Pinch>
                </View>
                <View style={s`absolute bottom-5 left-0 right-0`}>
                  <Pinch>
                    <Text style={[ s`text-3xl text-white font-bold text-center min-w-80`, { shadowOpacity: 10 }]}>
                      {textInImage}
                    </Text>
                  </Pinch>
                </View>
              </View>
            </ViewShot>
            {
              loading && (
                <View
                  style={[
                    s`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center`,
                    { backgroundColor: 'rgba(40,50,60,0.8)' },
                  ]}
                >
                  <Text style={s`text-white text-center text-lg font-semibold pb-4`}>
                    {'Content coming soon, \nplease wait!'}
                  </Text>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )
            }
          </View>
          <View style={s`px-container`}>
            <View style={s`flex-row pb-4 items-center`}>
              <Button
                style={s`flex-1`}
                onPress={onSubmit}
                disabled={!store || !station || !menu || loading}
              >
                {caption ? 'Re-Generate! GPT!' : 'Generate! GPT!'}
              </Button>
              {
                caption && (
                  <Button
                    style={s`ml-4`}
                    onPress={onSave}
                    disabled={!store || !station || !menu || loading}
                  >
                    Save for post
                  </Button>
                )
              }
            </View>
            {
              caption && (
                <InputWithLabel
                  label="Output Caption"
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                />
              )
            }
            <View style={s`items-end`}>
              <TouchableOpacity
                onPress={() => Linking.openURL(gooleMapLink)}
              >
                <Text style={s`text-primary underline`}>
                  Recall where something is on a map.
                </Text>
              </TouchableOpacity>
            </View>
            <InputWithLabel
              label="Store"
              value={store}
              onChangeText={setStore}
              placeholder="The Daps Famous Hood Joint"
            />
            <InputWithLabel
              label="Station"
              value={station}
              onChangeText={setStation}
              placeholder="Kichijoji"
            />
            <View style={s`w-full border-b border-bordergray mb-4`} />
            <InputWithLabel
              label="Menu"
              value={menu}
              onChangeText={setMenu}
              placeholder="Chicken Over Rice"
            />
            <InputWithLabel
              label="Additional Description"
              value={description}
              multiline
              onChangeText={setDescription}
              placeholder="I want to eat it again!"
            />
          </View>
        </ScrollView>
      </ExKeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default EditScreen
