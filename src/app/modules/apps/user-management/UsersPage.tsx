import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {UsersListWrapper} from './users-list/UsersList'
import {SuspendedUsersListWrapper} from './users-list/SuspendedUsersList'

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'User Management',
    path: '/p/users',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='users'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Users list</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
        <Route
          path='users/suspended'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Suspended Users</PageTitle>
              <SuspendedUsersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='users' replace />} />
    </Routes>
  )
}

export default UsersPage