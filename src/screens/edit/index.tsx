import { useRef, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ViewShot from 'react-native-view-shot'
import { s } from 'react-native-wind'

import { Image } from 'expo-image'
import { ImagePickerAsset } from 'expo-image-picker'
import useSWR from 'swr'

import { sendMessageGPT } from '@/api/gpt'
import Button from '@/components/button'
import { InputWithLabel } from '@/components/input'
import ExKeyboardAvoidingView from '@/components/keyboardAvoidingView'
import Pinch from '@/components/pinch'
import { SWR_KEY } from '@/constants'

const prompt = (menu: string, store: string, station: string, description?: string) => {
  return `
  店舗名: ${store}
  料理名: ${menu}
  駅名: ${station}
  店についての説明: ${description || 'なし'}
  以上の情報からグルメのインスタグラマーとして、レストランの食事をインスタグラムに投稿する。
  高いインプレッションを得るための以下の要件に合うよう、JSON形式で答えてください。
  【要件】
  caption: 画像の紹介文。ハッシュタグは含めない。文字数は170文字以上。
  hashtags: 画像に付けるハッシュタグ。日本語と英語を含む合計20個から30個で、ハッシュタグは1つの文字列にまとめる
  textInImage: 画像内に表示するキャッチコピー。改行ありで2行で25文字以下
  信憑性に欠ける情報は避けてください。

  以下は例です
  {
    "caption": "【吉祥寺で本場のNYローカルフードを🇺🇸】\\n\\n吉祥寺に昨年夏にオープンした「The Daps Famous Hood Joint」。ニューヨークに住んでたというオーナーが作った店の世界観はまさにアメリカそのもの。マジでドープでカッコいい。\\nそんなお店でいただけるのが本場のローカルフード、チキンオーバーライスとサンドイッチ。心ゆくままにジャンクなフードをコーラを片手に食べられる体験はマジで最高。\\nこの最高な体験を東京は吉祥寺で味わえるなんて、、、。\\nメシボーイの世界観が好きなみんなならきっと気にいるはず！\\n是非みんなも行ってみてね✌️",
    "hashtags": "#サンドウィッチ  #チキンオーバーライス  #吉祥寺  #吉祥寺グルメ  #吉祥寺ランチ  #吉祥寺ディナー  #東京グルメ  #東京ランチ  #アメリカンフード  #コーラ  #ニューヨーク  #食べログ  #ローカルフード  #アメリカンカフェ  #中央線グルメ  #中央線  #中央線ランチ  #カフェグルメ  #井の頭線グルメ  #井の頭線  #京王線  #京王線グルメ  #武蔵野市  #ハンバーガー  #chickenoverrice  #sandwich  #newyork  #america",
    "textInImage": "DOPEなローカルフードで\\nNY気分を吉祥寺で味わう"
  }
  `
}

const EditScreen = () => {
  const { data: asset } = useSWR<ImagePickerAsset>(SWR_KEY.ASSET)
  const ref = useRef<ViewShot>(null)

  const [ menu, setMenu ] = useState('')
  const [ store, setStore ] = useState('')
  const [ station, setStation ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ caption, setCaption ] = useState('')
  const [ hashtags, setHashtags ] = useState('')
  const [ textInImage, setTextInImage ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const shot = () => {
    if (ref.current?.capture) {
      ref.current.capture().then((uri) => {
        const shareOptions = {
          title: 'Share via',
          message: 'Share via',
          url: uri,
        }
        Share.share(shareOptions)
      })
    }
  }

  const submit = async () => {
    if (!store || !station || !menu) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
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
    setHashtags(contents.hashtags)
    setTextInImage(contents.textInImage)
    setLoading(false)
  }

  return (
    <SafeAreaView style={s`flex-1 bg-midnight`}>
      <ExKeyboardAvoidingView>
        <ScrollView>
          <ViewShot ref={ref}>
            <View style={[ s`pb-4 relative w-full`, { aspectRatio: 1 }]}>
              <Image source={{ uri: asset?.uri }} style={s`w-full h-full`} />
              <View style={s`absolute top-5 left-5`}>
                <Pinch>
                  <Text style={[ s`text-5xl text-white font-bold`, { shadowOpacity: 10 }]}>
                    {station}
                  </Text>
                </Pinch>
                <Pinch>
                  <Text style={[ s`text-3xl text-white font-bold`, { shadowOpacity: 10 }]}>
                    {store}
                  </Text>
                </Pinch>
              </View>
              <View style={s`absolute bottom-5 left-0 right-0`}>
                <Pinch>
                  <Text style={[ s`text-3xl text-white font-bold text-center`, { shadowOpacity: 10 }]}>
                    {textInImage}
                  </Text>
                </Pinch>
              </View>
            </View>
          </ViewShot>
          <View style={s`px-container`}>
            {
              <TouchableOpacity onPress={shot}>
                <Text style={s`text-center text-white text-xl font-bold border border-white py-1 mb-2 rounded-sm`}>Save or Share Photo</Text>
              </TouchableOpacity>
            }
            {
              loading && <ActivityIndicator size="small" color=" #fff" style={s`pb-4`} />
            }
            {
              caption && hashtags && (
                <>
                  <Text style={s`font-bold text-primary pb-1`}>Caption</Text>
                  <Text style={s`text-white pb-4`} selectable>{`${caption}\n${hashtags}`}</Text>
                </>
              )
            }
            <InputWithLabel
              label="Menu"
              value={menu}
              onChangeText={setMenu}
            />
            <InputWithLabel
              label="Store"
              value={store}
              onChangeText={setStore}
            />
            <InputWithLabel
              label="Station"
              value={station}
              onChangeText={setStation}
            />
            <InputWithLabel
              label="Additional Description"
              value={description}
              onChangeText={setDescription}
            />
            <View style={s`items-center py-4`}>
              <Button onPress={submit}>Please think GPT!</Button>
            </View>
          </View>
        </ScrollView>
      </ExKeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default EditScreen
