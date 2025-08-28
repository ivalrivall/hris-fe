import { useIntl } from 'react-intl'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useAuth } from '@modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const { currentUser } = useAuth()
  const isAdmin = !!(currentUser && currentUser.role && currentUser.role.includes('ADMIN'))

  return (
    <>
      {isAdmin ? (
        <>
          <SidebarMenuItem
            to='/dashboard'
            title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
            fontIcon='bi-speedometer2'
          />
          <SidebarMenuItem
            to='/employee'
            title='Employee Management'
            fontIcon='bi-people'
          />
        </>
      ) : (
        <SidebarMenuItem
          to='/account/overview'
          title='Account'
          fontIcon='bi-person-circle'
        />
      )}
    </>
  )
}

export { SidebarMenuMain }
