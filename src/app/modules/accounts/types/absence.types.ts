import { UserModel } from "@modules/auth"

export interface AbsenceModel {
  id: number
  createdAt: string
  updatedAt: string
  user?: UserModel
  status: 'in' | 'out'
}

export interface listAbsenceOfUserQuery {
  page?: number
  take?: number
  order?: 'DESC' | 'ASC'
  q?: string
  startDate?: string // ISO date string (YYYY-MM-DD)
  endDate?: string   // ISO date string (YYYY-MM-DD)
}

export interface AbsenceListResponse {
  data: AbsenceModel[]
  meta: {
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
    page: number
    take: number
  }
}