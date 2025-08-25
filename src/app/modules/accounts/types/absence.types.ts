import { UserModel } from "@modules/auth"

export interface AbsenceModel {
  id: number
  createdAt: string
  updatedAt: string
  user: UserModel
  status: 'in' | 'out'
}