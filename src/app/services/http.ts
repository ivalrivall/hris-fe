import axios, { AxiosError, AxiosInstance } from 'axios'
import { getAuth, AUTH_LOCAL_STORAGE_KEY } from '../modules/auth'

const API_URL = import.meta.env.VITE_APP_API_URL as string

const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // enable if your API uses cookies
})

http.interceptors.request.use((config) => {
  const auth = getAuth()
  const token = auth?.accessToken?.token
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
      } catch {
        console.error('Failed to clear auth from localStorage')
      }
    }
    return Promise.reject(error)
  }
)

export default http