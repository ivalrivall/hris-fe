
import { FC } from 'react'
import { toAbsoluteUrl } from '@metronic/helpers'
import { User } from '../../core/_models'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({ user }) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {user.avatar ? (
          <div className='symbol-label'>
            <img src={user.avatar} alt={user.name} className='w-100' />
          </div>
        ) : (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`media/avatars/blank.png`)} alt={user.name} className='w-100' />
          </div>
        )}
      </a>
    </div>
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {user.name}
      </a>
      <span>{user.email}</span>
      <span>{user.phone}</span>
    </div>
  </div>
)

export { UserInfoCell }
