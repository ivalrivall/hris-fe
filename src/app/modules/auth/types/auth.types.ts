export interface AccessTokenModel {
  expiresIn: number
  token: string
}

export interface AuthModel {
  accessToken: AccessTokenModel
  refreshToken?: string
}

export interface UserModel {
  id: number
  name: string
  password: string
  email: string
  phone: string
  role: string
  avatar?: string
  auth?: AuthModel
}