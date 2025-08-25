import { FC, Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import { DashboardWrapper } from '../modules/dashboard/pages/DashboardPage'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import { useAuth } from '../modules/auth'
import AccountPage from '@modules/accounts/pages/AccountPage'

const UsersPage = lazy(() => import('../modules/users/pages/UsersPage'))

// ----------
// Utilities
// ----------
const hasRole = (role: string | undefined, match: string) => !!role && role.includes(match)

const RoleRoute: FC<WithChildren & { allow: (role: string | undefined) => boolean; redirect?: string }> = ({
  allow,
  redirect = '/account',
  children,
}) => {
  const { currentUser } = useAuth()
  return allow(currentUser?.role) ? <>{children}</> : <Navigate to={redirect} replace />
}

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: { '0': baseColor },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

// ----------
// Routes
// ----------
const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}> {
      }
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />

        {/** Pages */}
        <Route
          path='dashboard'
          element={
            <RoleRoute allow={(r) => hasRole(r, 'ADMIN')} redirect='/account'>
              <DashboardWrapper />
            </RoleRoute>
          }
        />

        <Route path='account/*' element={
          <SuspensedView>
              <RoleRoute allow={(r) => hasRole(r, 'USER')}>
                <AccountPage />
              </RoleRoute>
          </SuspensedView>
        } />

        <Route
          path='employee/*'
          element={
            <SuspensedView>
              <RoleRoute allow={(r) => hasRole(r, 'ADMIN')}>
                <UsersPage />
              </RoleRoute>
            </SuspensedView>
          }
        />

        {/** Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export { PrivateRoutes }