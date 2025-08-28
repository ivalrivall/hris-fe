import { ColumnDef } from '@tanstack/react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserCreatedAtCell } from './UserCreatedAtCell'
import { UserActionsCell } from './UserActionsCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserModel } from '@modules/users/types'
import { UserPositionCell } from './UserPositionCell'
import { UserRoleCell } from './UserRoleCell'

const usersColumns: ColumnDef<UserModel>[] = [
  {
    header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    id: 'name',
    cell: (info) => <UserInfoCell user={info.row.original} />,
  },
  {
    header: (props) => <UserCustomHeader tableProps={props} title='Job Position' className='min-w-125px' />,
    accessorKey: 'position',
    cell: (info) => <UserPositionCell position={info.row.original.position} />,
  },
  {
    header: (props) => (
      <UserCustomHeader tableProps={props} title='Role' className='min-w-125px' />
    ),
    id: 'role',
    cell: (info) => <UserRoleCell role={info.row.original.role} />,
  },
  {
    header: (props) => (
      <UserCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
    ),
    accessorKey: 'created_at',
    cell: (info) => <UserCreatedAtCell created_at={info.row.original.createdAt} />,
  },
  {
    header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    cell: (info) => <UserActionsCell id={info.row.original.id} />,
  },
]

export { usersColumns }
