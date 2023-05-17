import { ReactNode, useRef, useState } from 'react'
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native'
import { s } from 'react-native-wind'

type Props = TextInputProps & {
  label: string
  LabelRightItem?: ReactNode
}

export const InputWithLabel = ({ label, LabelRightItem, ...props }: Props) => {
  const ref = useRef<TextInput>(null)
  const [ isFocused, setIsFocused ] = useState(false)
  return (
    <View style={s`pb-4 relative`}>
      <Text style={[ s`text-sm text-primary`, isFocused && s`font-bold` ]}>{label}</Text>
      <TextInput
        ref={ref}
        style={s`text-white min-h-10`}
        placeholder="Input Text..."
        placeholderTextColor="#888"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        scrollEnabled={false}
        returnKeyType={props.multiline ? 'default' : 'next'}
        {...props}
      />
      {
        !isFocused && (
          <TouchableOpacity
            style={s`absolute right-0 top-0 bottom-0 left-0`}
            onLongPress={() => ref.current?.focus()}
          />
        )
      }
      {
        LabelRightItem && (
          <View style={s`absolute right-0 top-0`}>
            {LabelRightItem}
          </View>
        )
      }
    </View>
  )
}

