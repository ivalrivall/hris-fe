import { FC } from 'react'
import { useIntl } from 'react-intl'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { Feeds } from '../../widgets/components/Feeds'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'

const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Widgets',
    path: '/crafted/widgets/charts',
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
          <Feeds />
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
