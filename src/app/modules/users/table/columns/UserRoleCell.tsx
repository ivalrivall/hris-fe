import { FC } from 'react'

type Props = {
  role: string
}

const UserRoleCell: FC<Props> = ({ role }) => (
  <div className='badge badge-light-success fw-bolder'>{role}</div>
)

export { UserRoleCell }
