import { FC } from 'react'

type Props = {
  position?: string
}

const UserPositionCell: FC<Props> = ({ position }) => (
  <div className='badge badge-light fw-bolder'>{position}</div>
)

export { UserPositionCell }
