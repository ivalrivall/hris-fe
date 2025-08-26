export type UserRole = 'ADMIN' | 'USER'

export interface UserModel {
  // Backend returns UUID strings for IDs
  id: string
  name: string
  email: string
  position: string
  role: UserRole | string

  // Timestamps from backend
  createdAt: string
  updatedAt: string

  // Attendance-related fields present in list response
  lastIn: string | null
  lastOut: string | null
  totalWorkDay: number
  totalPresence: number
  totalAbsent: number
  totalLate: number

  // Optional legacy/client-only fields kept for compatibility with UI (if used)
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
  startDate?: string // ISO date string (YYYY-MM-DD)
  endDate?: string   // ISO date string (YYYY-MM-DD)
}

export interface UserListResponse {
  data: UserModel[]
  meta: {
    itemCount: number
    pageCount: number | null
    hasPreviousPage: boolean
    hasNextPage: boolean
    // Some responses may omit these
    page?: number
    take?: number
  }
}