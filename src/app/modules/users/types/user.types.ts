export interface UserModel {
  id: number
  name: string
  password: string
  email: string
  phone: string
  role: string
  avatar?: string
  position: string
}

export interface UserStats {
  totalWorkDay: number
  totalPresence: number
  totalAbsent: number
  totalLate: number
}