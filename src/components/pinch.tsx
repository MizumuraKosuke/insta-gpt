import React, { memo } from 'react'
import { Platform } from 'react-native'
import { Gesture, GestureDetector  } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

type Props = {
  children: React.ReactNode
}

const Pinch = ({ children }: Props) => {
  const scale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const currentScale = useSharedValue(0)
  const currentX = useSharedValue(0)
  const currentY = useSharedValue(0)
  
  const pinch = Gesture.Pinch()
    .onStart(() => {
      currentScale.value = scale.value
    })
    .onUpdate((e) => {
      scale.value = scale.value + e.velocity * (e.velocity > 1 ? 1 : 2) * (Platform.OS === 'android' ? 3 : 0.01)
    })
  
  const pan = Gesture.Pan()
    .onStart(() => {
      currentX.value = translateX.value
      currentY.value = translateY.value
    })
    .onUpdate((e) => {
      translateX.value =  currentX.value + e.translationX
      translateY.value =  currentY.value + e.translationY
    })
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }
  })

  return (
    <GestureDetector gesture={Gesture.Simultaneous(pinch, pan)}>
      <Animated.View style={animatedStyles}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}

export default memo(Pinch)
