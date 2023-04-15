import { Text, TextInput, TextInputProps, View } from 'react-native'
import { s } from 'react-native-wind'

const Input = (props: TextInputProps) => {
  return (
    <TextInput
      style={s`bg-white h-10 px-4 border border-primary rounded-lg`}
      {...props}
    />
  )
}

type Props = TextInputProps & {
  label: string
}

export const InputWithLabel = ({ label, ...props }: Props) => {
  return (
    <View style={s`pb-4`}>
      <Text style={s`text-sm text-white pb-2`}>{label}</Text>
      <Input {...props} />
    </View>
  )
}

export default Input
