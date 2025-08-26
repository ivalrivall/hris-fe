import { UserModel } from "@modules/auth"

export interface AbsenceModel {
  id: number
  createdAt: string
  updatedAt: string
  user?: UserModel
  status: 'in' | 'out'
}

export interface listAbsenceQuery {
  page?: number
  take?: number
  order?: 'DESC' | 'ASC'
  q?: string
  startDate?: string
  endDate?: string
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