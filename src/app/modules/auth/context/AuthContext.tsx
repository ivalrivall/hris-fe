import { createContext, useState, useContext, Dispatch, SetStateAction, FC } from 'react'
import { AuthModel, UserModel } from '@modules/auth/types/auth.types'
import * as authHelper from '../helpers/auth.helper'
import { logout as logoutApi } from '@modules/auth/api'
import { WithChildren } from '@metronic/helpers'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContext: AuthContextProps = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContext)

export const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
        authHelper.setAuth(auth)
    } else {
        authHelper.removeAuth()
    }
  }

  const logout = async () => {
    try {
      await logoutApi().catch(() => {})
    } finally {
      saveAuth(undefined)
      setCurrentUser(undefined)
    }
  }

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
