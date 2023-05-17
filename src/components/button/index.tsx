import { ReactNode, memo } from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { s } from 'react-native-wind'

type Props = TouchableOpacityProps & {
  children: ReactNode
}

const Button = ({ children, style, ...props }: Props) => {
  return (
    <TouchableOpacity
      style={[
        s`bg-primary px-4 py-2 rounded-lg flex-row items-center justify-center`,
        props.disabled && { opacity: 0.3 },
        style,
      ]}
      {...props}
    >
      <Text style={s`text-lg text-midnight font-semibold`}>{children}</Text>
    </TouchableOpacity>
  )
}

export default memo(Button)
