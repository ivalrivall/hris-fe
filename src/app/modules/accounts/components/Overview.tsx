import { Link } from 'react-router-dom'
import { KTIcon } from '@metronic/helpers'
import type { UserModel } from '@modules/auth/types/auth.types'
import { ListsWidget5 } from '@metronic/partials/widgets'
import { Content } from '@metronic/layout/components/content'
/**
 * TODO
 * implement identitas karyawan
 * ringkasan kehadiran bulan ini (total hari kerja, masuk, tidak masuk, terlambat masuk, lembur)
 * status hari ini (hadir, belum absen, terlambat) , jam masuk & jam pulang jika sudah absen
 * riwayat absen 7 hari terakhir
 */
export function Overview({ user }: { user?: UserModel }) {
  return (
    <Content>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>

          <Link to='/crafted/account/settings' className='btn btn-primary align-self-center'>
            Edit Profile
          </Link>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Full Name</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-gray-900'>{user?.name ?? '-'}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Email</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{user?.email ?? '-'}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Contact Phone
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{user?.phone ?? '-'}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Role</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-gray-900'>{user?.role ?? '-'}</span>
            </div>
          </div>

          <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6'>
            <KTIcon iconName='information-5' className='fs-2tx text-warning me-4' />
            <div className='d-flex flex-stack flex-grow-1'>
              <div className='fw-bold'>
                <h4 className='text-gray-800 fw-bolder'>We need your attention!</h4>
                <div className='fs-6 text-gray-600'>
                  Your payment was declined. To start using tools, please
                  <Link className='fw-bolder' to='/crafted/account/settings'>
                    {' '}
                    Add Payment Method
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-12'>
          <ListsWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div>
    </Content>
  )
}
