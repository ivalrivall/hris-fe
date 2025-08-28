export type UserRole = 'ADMIN' | 'USER'

export interface UserModel {
  id: string
  name: string
  email: string
  position: string
  role: UserRole | string

  createdAt: string
  updatedAt: string

  lastIn: string | null
  lastOut: string | null
  totalWorkDay: number
  totalPresence: number
  totalAbsent: number
  totalLate: number

  password?: string
  phone?: string
  avatar?: string
}

export interface UserStats {
  totalWorkDay: number
  totalPresence: number
  totalAbsent: number
  totalLate: number
}

export interface listUserQuery {
  page?: number
  take?: number
  order?: 'DESC' | 'ASC'
  q?: string
  startDate?: string
  endDate?: string
}

export interface UserListResponse {
  data: UserModel[]
  meta: {
    itemCount: number
    pageCount: number | null
    hasPreviousPage: boolean
    hasNextPage: boolean
    page?: number
    take?: number
  }
}