import { FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { Logout, AuthPage, useAuth } from '../modules/auth'
import { App } from '../App'
import { ToastProvider } from '../components/ToastProvider'

const { BASE_URL } = import.meta.env

const AppRoutes: FC = () => {
  const { currentUser } = useAuth()
  return (
    <BrowserRouter basename={BASE_URL}>
      <ToastProvider>
        <Routes>
          <Route element={<App />}>
            <Route path='error/*' element={<ErrorsPage />} />
            <Route path='logout' element={<Logout />} />
            {currentUser ? (
              <>
                <Route path='/*' element={<PrivateRoutes />} />
                <Route index element={<Navigate to='/dashboard' />} />
              </>
            ) : (
              <>
                <Route path='auth/*' element={<AuthPage />} />
                <Route path='*' element={<Navigate to='/auth' />} />
              </>
            )}
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export { AppRoutes }
