import {ColumnDef} from '@tanstack/react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../core/_models'

const usersColumns: ColumnDef<User>[] = [
  {
    header: () => <UserSelectionHeader />,
    id: 'selection',
    cell: (info) => <UserSelectionCell id={info.row.original.id} />,
  },
  {
    header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    id: 'name',
    cell: (info) => <UserInfoCell user={info.row.original} />,
  },
  {
    header: (props) => <UserCustomHeader tableProps={props} title='Job Position' className='min-w-125px' />,
    accessorKey: 'position',
  },
  {
    header: (props) => (
      <UserCustomHeader tableProps={props} title='Last check in' className='min-w-125px' />
    ),
    id: 'last_login',
    cell: (info) => <UserLastLoginCell last_login={info.row.original.last_login} />,
  },
  {
    header: (props) => (
      <UserCustomHeader tableProps={props} title='Last checkout' className='min-w-125px' />
    ),
    id: 'two_steps',
    cell: (info) => <UserTwoStepsCell two_steps={info.row.original.two_steps} />,
  },
  {
    header: (props) => (
      <UserCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
    ),
    accessorKey: 'joined_day',
  },
  {
    header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    cell: (info) => <UserActionsCell id={info.row.original.id} />,
  },
]

export {usersColumns}
