import { FC } from 'react'
import { useIntl } from 'react-intl'
import { PageTitle } from '../../../_metronic/layout/core'
import { Content } from '../../../_metronic/layout/components/content'
import { useAuth } from '../../modules/auth'
import { Navigate } from 'react-router-dom'

const UserDashboardPage: FC = () => {
  return (
    <>
      <Content>
        {/* begin::Row */}
        <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
          {/* begin::Col */}
          <div className='col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-5 mb-xl-10'>
            <div className='card'>
              <div className='card-header'>
                <h3 className='card-title'>User Dashboard</h3>
              </div>
              <div className='card-body'>
                <p>Welcome to your dashboard. As a user, you can view your personal information and activities here.</p>
                {/* Add user-specific widgets here */}
              </div>
            </div>
          </div>
          {/* end::Col */}
        </div>
        {/* end::Row */}
      </Content>
    </>
  )
}

const UserDashboardWrapper: FC = () => {
  const intl = useIntl()
  const { currentUser } = useAuth()

  // If user role is not 'user', redirect to admin dashboard
  if (currentUser && currentUser.roles && currentUser.roles.includes(1)) {
    return <Navigate to='/dashboard' />
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <UserDashboardPage />
    </>
  )
}

export { UserDashboardWrapper }