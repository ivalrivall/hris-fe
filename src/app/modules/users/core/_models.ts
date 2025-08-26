import { ID, Response } from '@metronic/helpers'
import { RoleType } from '@modules/auth'
export type User = {
  id?: ID
  name?: string
  avatar?: string
  email?: string
  phone?: string
  password?: string
  password_confirmation?: string
  position?: string
  role?: string
  last_login?: string
  joined_day?: string
  initials?: {
    label: string
    state: string
  }
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: '',
  position: '',
  role: RoleType.USER,
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
}
