import { UserModel } from './types/auth.types'
import http from '../../services/http'

const ENDPOINTS = {
  me: '/v1/auth/me',
  login: '/v1/auth/login',
  logout: '/v1/auth/logout',
  register: '/v1/register',
  requestPassword: '/v1/forgot_password',
} as const

export function login(email: string, password: string) {
  return http.post<{ user: UserModel; accessToken: { expiresIn: number; token: string } }>(
    ENDPOINTS.login,
    { email, password }
  )
}

export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return http.post(ENDPOINTS.register, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

export function requestPassword(email: string) {
  return http.post<{ result: boolean }>(ENDPOINTS.requestPassword, { email })
}

export function getUserByToken(token?: string) {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  return http.get<UserModel>(ENDPOINTS.me, config)
}

export function logout() {
  return http.post(ENDPOINTS.logout)
}