import { UserModel, UserStats } from './types/user.types'
import http from '../../services/http'

const ENDPOINTS = {
  user: '/v1/users',
} as const

export function createUser(
  email: string,
  name: string,
  position: string,
  password: string,
  password_confirmation: string
) {
  return http.post(ENDPOINTS.user, {
    email,
    name: name,
    position: position,
    role: "USER",
    password,
    password_confirmation,
  })
}

export function listUser() {
  return http.get<UserModel[]>(ENDPOINTS.user)
}

// Fetch user stats from authenticated users endpoint
export function getUserStats(userId: number) {
  return http.get<UserStats>(ENDPOINTS.user + `/${userId}`)
}
