import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { Overview } from '../components/Overview'
import { AccountHeader } from '../components/AccountHeader'
import { useQuery } from '@tanstack/react-query'
import { getUserByToken } from '../../../modules/auth/api'
import type { UserModel } from '../../../modules/auth/types/auth.types'

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/account/overview',
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

const AccountPage: React.FC = () => {
  const { data: user, isLoading, isError } = useQuery<UserModel>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await getUserByToken()
      return data
    },
  })

  return (
    <Routes>
      <Route
        element={
          <>
            <AccountHeader user={user} />
            {isLoading ? (
                <div className='p-10'>Loading profile...</div>
              ) : isError ? (
                <div className='alert alert-danger m-10'>Failed to load profile.</div>
              ) : (
                <Overview user={user} />
              )}
          </>
        }
      >
        <Route
          path='overview'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle>
              {isLoading ? (
                <div className='p-10'>Loading profile...</div>
              ) : isError ? (
                <div className='alert alert-danger m-10'>Failed to load profile.</div>
              ) : (
                <Overview user={user} />
              )}
            </>
          }
        />
        <Route index element={<Navigate to='/account/overview' />} />
      </Route>
    </Routes>
  )
}

export default AccountPage
