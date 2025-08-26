import { listUserQuery, UserListResponse, UserModel, UserStats } from './types/user.types'
import http from '../../services/http'
import { RoleType } from '@modules/auth'

const ENDPOINTS = {
  user: '/v1/users',
} as const

export function createUser(
  email: string,
  name: string,
  position: string,
  phone: string,
  password: string,
) {
  return http.post(ENDPOINTS.user, {
    email,
    name: name,
    position: position,
    phone,
    role: RoleType.USER,
    password,
  })
}

export function listUser(query: listUserQuery) {
  return http.get<UserListResponse>(ENDPOINTS.user, { params: query })
}

export function getUserStats(userId: number) {
  return http.get<UserStats>(ENDPOINTS.user + `/${userId}`)
}

export function getUserById(id: string) {
    return http.get<UserModel>(`${ENDPOINTS.user}/${id}`)
}

export function updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      position?: string;
      phone?: string;
      password?: string;
      password_confirmation?: string;
      role?: string;
    },
    file?: File | Blob
) {
    if (file) {
      const form = new FormData()
      // Append scalar fields if present
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          form.append(key, String(value))
        }
      })
      form.append('file', file)
      return http.patch<{ user: UserModel }>(`${ENDPOINTS.user}/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }

    return http.patch<{ user: UserModel }>(`${ENDPOINTS.user}/${id}`, data)
}

export function updateUserAvatar(id: string, file: File | Blob) {
  const form = new FormData()
  form.append('file', file)
  return http.patch(`${ENDPOINTS.user}/${id}/avatar`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function deleteUser(id: string) {
    return http.delete<{ status: boolean }>(`${ENDPOINTS.user}/${id}`)
}