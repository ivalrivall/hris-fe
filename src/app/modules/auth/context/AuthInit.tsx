// src/app/modules/auth/context/AuthInit.tsx
import { FC, useEffect, useState } from 'react'
import { LayoutSplashScreen } from '@metronic/layout/core'
import { getUserByToken } from '@modules/auth/api'
import { useAuth } from './AuthContext'
import { WithChildren } from '@metronic/helpers'

export const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!currentUser) {
          const { data } = await getUserByToken()
          if (data) {
            setCurrentUser(data)
          }
        }
      } catch (err) {
        console.error(err)
        if (currentUser) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }
    }

    if (auth?.accessToken?.token) {
      requestUser()
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}
