import {FC} from 'react'
import {
  FeedsWidget2,
  FeedsWidget3,
  FeedsWidget4,
  FeedsWidget5,
  FeedsWidget6,
} from '../../../../_metronic/partials/widgets'
import { Content } from '../../../../_metronic/layout/components/content'

const Feeds: FC = () => {
  return (
    <>
      <Content>
        <div className='row g-5 g-xl-8'>
            {/* begin::Col */}
            <div className='col-xl-4'>
              <FeedsWidget2 className='mb-5 mb-xl-8' />
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col-xl-4'>
              <FeedsWidget2 className='mb-5 mb-xl-8' />
            </div>
            {/* end::Col */}

            {/* begin::Col */}
            <div className='col-xl-4'>
              <FeedsWidget2 className='mb-5 mb-xl-8' />
            </div>
            {/* end::Col */}
        </div>
      </Content>
    </>
  )
}

export {Feeds}
