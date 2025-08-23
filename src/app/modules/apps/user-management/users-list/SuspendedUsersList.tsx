import {ListViewProvider, useListView} from './core/ListViewProvider'
import {SuspendedQueryRequestProvider} from './core/SuspendedQueryRequestProvider'
import {SuspendedQueryResponseProvider} from './core/SuspendedQueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {UsersTable} from './table/UsersTable'
import {UserEditModal} from './user-edit-modal/UserEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import { Content } from '../../../../../_metronic/layout/components/content'

const SuspendedUsersList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const SuspendedUsersListWrapper = () => (
  <SuspendedQueryRequestProvider>
    <SuspendedQueryResponseProvider>
      <ListViewProvider>
        <Content>
          <SuspendedUsersList />
        </Content>
      </ListViewProvider>
    </SuspendedQueryResponseProvider>
  </SuspendedQueryRequestProvider>
)

export {SuspendedUsersListWrapper}