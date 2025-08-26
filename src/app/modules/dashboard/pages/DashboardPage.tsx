import { FC } from 'react'
import { useIntl } from 'react-intl'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { AllAbsencesList } from '../components/AllAbsencesList'

const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Dashboard',
    path: '/dashboard',
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

const DashboardPage: FC = () => (
  <>
    <ToolbarWrapper />
    <Content>
      {/* begin::Row */}
      <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
        {/* begin::Col */}
        <div className='col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-5 mb-xl-10'>
          <PageTitle breadcrumbs={widgetsBreadCrumbs}>List Absence</PageTitle>
          <AllAbsencesList className='mb-5' title='All Users Absences' />
        </div>
        {/* end::Col */}
      </div>
      {/* end::Row */}
    </Content>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
