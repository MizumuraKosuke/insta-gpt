import React, { useEffect, useState } from 'react'
import {
  Platform,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

type Props = KeyboardAvoidingViewProps & {
  children: React.ReactNode
}

const ExKeyboardAvoidingView = ({ children, ...props }: Props) => {
  const [ isVisible, setVisible ] = useState(false)
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setVisible(true))
    Keyboard.addListener('keyboardDidHide', () => setVisible(false))
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow')
      Keyboard.removeAllListeners('keyboardDidHide')
    }
  }, [])

  return (
    <TouchableWithoutFeedback disabled={!isVisible} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
        {...props}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default ExKeyboardAvoidingView
