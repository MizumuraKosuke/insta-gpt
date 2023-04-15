/* eslint-disable no-console */
import axios, { AxiosRequestConfig } from 'axios'

type TFetchResponse<T> = Promise<T | {error: string}>

export const fetchWithErrorHandling = async <T>(
  url: string,
  token?: string,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (options.method) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  console.log(`${options.method || 'GET'} ${url}`)

  const response = await axios({
    url,
    headers,
    ...options,
  })
    .catch((e) => {
      console.error('Error with ', e)
      return { error: 'エラーが発生しました。' }
    })

  if ('error' in response) {
    return { error: response.error }
  }

  return response.data
}

export const get = <T>(
  url: string,
  token: string | undefined,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  return fetchWithErrorHandling<T>(
    url,
    token,
    {
      method: 'GET',
      ...options,
    },
  )
}

export const post = <T>(
  url: string,
  token: string | undefined,
  body: Record<string, unknown> | FormData | File,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  const data = JSON.stringify(body || {})
  return fetchWithErrorHandling(url, token, {
    method: 'POST',
    data,
    ...options,
  })
}

export const put = <T>(
  url: string,
  token: string | undefined,
  body: Record<string, unknown> | FormData | File,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  const data = JSON.stringify(body || {})
  return fetchWithErrorHandling(url, token, {
    method: 'PUT',
    data,
    ...options,
  })
}

export const destroy = <T>(
  url: string,
  token: string | undefined,
  options: AxiosRequestConfig = {},
): Promise<TFetchResponse<T>> => {
  return fetchWithErrorHandling(url, token, { method: 'DELETE', ...options })
}
