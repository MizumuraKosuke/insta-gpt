import { ReactNode } from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { s } from 'react-native-wind'

type Props = TouchableOpacityProps & {
  children: ReactNode
}

const Button = ({ children, ...props }: Props) => {
  return (
    <TouchableOpacity
      style={s`bg-primary px-4 py-2 rounded-lg flex-row items-center justify-center`}
      {...props}
    >
      <Text style={s`text-lg text-midnight font-semibold`}>{children}</Text>
    </TouchableOpacity>
  )
}

export default Button
