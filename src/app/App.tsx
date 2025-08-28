import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import { MasterInit } from '../_metronic/layout/MasterInit'
import { AuthInit, useAuth } from './modules/auth'
import { ThemeModeProvider } from '../_metronic/partials'
import { useFirebaseMessaging } from './hooks/FirebaseMessaging'

const App = () => {
  const { currentUser } = useAuth()
  const isAdmin = !!(currentUser && currentUser.role && currentUser.role.includes('ADMIN'))

  // Subscribe ADMINs to topic and show foreground notifications
  useFirebaseMessaging(undefined, { shouldSubscribe: isAdmin, topic: 'user.ADMIN' })

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  )
}

export { App }
