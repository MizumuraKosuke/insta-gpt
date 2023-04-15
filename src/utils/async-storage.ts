import AsyncStorage from '@react-native-async-storage/async-storage'

const cacheData = new Map()

export const setStorageData = async (key: string, data: unknown): Promise<void> => {
  try {
    const value = JSON.stringify(data)
    await AsyncStorage.setItem(key, value)
    cacheData.set(key, data)
  }
  catch (e) {
    console.log(e)
  }
}

export const getStorageData = async <T>(key: string): Promise<T | null> => {
  if (cacheData.has(key)) {
    return cacheData.get(key) as T
  }
  let jsonValue
  try {
    jsonValue = await AsyncStorage.getItem(key)
  }
  catch (e) {
    console.log(e)
    return null
  }

  if (jsonValue === null) {
    return null
  }

  try {
    return JSON.parse(jsonValue)
  }
  catch (e) {
    console.log(e)
  }

  try {
    return JSON.parse(`${jsonValue}`)
  }
  catch (e) {
    console.log(e)
    return null
  }
}

export const removeStorageData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
    cacheData.delete(key)
  }
  catch (e) {
    console.log(e)
  }
}
