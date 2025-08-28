import { FC } from 'react'

type Props = {
  created_at?: string
}

const UserCreatedAtCell: FC<Props> = ({ created_at }) => {
  const text = created_at ? new Date(created_at).toLocaleString() : '-'
  return <div className='badge badge-light fw-bolder'>{text}</div>
}

export { UserCreatedAtCell }
