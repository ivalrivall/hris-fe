import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '@metronic/helpers'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { ToolbarWrapper } from '@metronic/layout/components/toolbar'
import { Content } from '@metronic/layout/components/content'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTodayAbsence, storeAbsence } from '../api'
import type { UserModel } from '@modules/auth/types/auth.types'
import type { AbsenceModel } from '../types/absence.types'

const AccountHeader: FC<{ user?: UserModel }> = ({ user }) => {
  const location = useLocation()
  const avatarSrc = user?.avatar && user.avatar.length > 0 ? user.avatar : toAbsoluteUrl('media/avatars/blank.png')

  const isOverview = location.pathname === '/account/overview'
  const isSettings = location.pathname === '/account/settings'

  const queryClient = useQueryClient()

  const { data: todayAbsences, isLoading: isAbsenceLoading } = useQuery<AbsenceModel[]>({
    queryKey: ['absence', 'today'],
    queryFn: async () => {
      const { data } = await getTodayAbsence()
      return data
    },
    enabled: !!user,
  })

  const { mutate: handleClockIn, isPending: isClockInLoading } = useMutation({
    mutationFn: async () => {
      await storeAbsence('in')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absence', 'today'] })
    },
  })

  const { mutate: handleClockOut, isPending: isClockOutLoading } = useMutation({
    mutationFn: async () => {
      await storeAbsence('out')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absence', 'today'] })
    },
  })

  const latestStatus: 'in' | 'out' | null = (() => {
    if (!todayAbsences || todayAbsences.length === 0) return null
    const sorted = [...todayAbsences].sort(
      (a, b) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
    )
    return sorted[sorted.length - 1].status
  })()

  const getAttendanceStatus = () => {
    if (isAbsenceLoading) return 'Loading...'
    if (!todayAbsences || todayAbsences.length === 0) return 'No Record'
    return latestStatus === 'in' ? 'Present' : 'Clocked Out'
  }

  const getAttendanceColor = () => {
    if (isAbsenceLoading || !todayAbsences || todayAbsences.length === 0) return 'text-gray-500'
    return latestStatus === 'in' ? 'text-success' : 'text-gray-500'
  }

  // Work time window and progress
  const toTodayAt = (hours: number, minutes: number) => {
    const d = new Date()
    d.setHours(hours, minutes, 0, 0)
    return d
  }
  const workStart = toTodayAt(8, 0)
  const workEnd = toTodayAt(18, 0)
  const now = new Date()
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max))
  const totalMs = Math.max(1, workEnd.getTime() - workStart.getTime())
  const progressPct = clamp(((now.getTime() - workStart.getTime()) / totalMs) * 100, 0, 100)

  const eventTime = (a: AbsenceModel) => new Date((a.updatedAt || a.createdAt))
  const firstIn = todayAbsences?.filter(a => a.status === 'in').sort((a, b) => eventTime(a).getTime() - eventTime(b).getTime())[0]
  const lastOut = todayAbsences?.filter(a => a.status === 'out').sort((a, b) => eventTime(a).getTime() - eventTime(b).getTime()).slice(-1)[0]
  const inMarkerPct = firstIn ? clamp(((eventTime(firstIn).getTime() - workStart.getTime()) / totalMs) * 100, 0, 100) : null
  const outMarkerPct = lastOut ? clamp(((eventTime(lastOut).getTime() - workStart.getTime()) / totalMs) * 100, 0, 100) : null

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formatDuration = (ms: number) => {
    const totalMin = Math.max(0, Math.floor(ms / 60000))
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }
  const elapsedFromInMs = firstIn ? Math.max(0, now.getTime() - eventTime(firstIn).getTime()) : 0

  return (
    <>
      <ToolbarWrapper />
      <Content>
        <div className='card mb-5 mb-xl-10'>
          <div className='card-body pt-9 pb-0'>
            <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
              <div className='me-7 mb-4'>
                <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
                  <img src={avatarSrc} alt='Avatar' />
                  <div className={`position-absolute translate-middle bottom-0 start-100 mb-6 rounded-circle border border-4 border-white h-20px w-20px ${todayAbsences && todayAbsences.some(a => a.status === 'in') ? 'bg-success' : 'bg-danger'}`}></div>
                </div>
              </div>

              <div className='flex-grow-1'>
                <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center mb-2'>
                      <a href='#' className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                        {user?.name ?? '-'}
                      </a>
                      <a
                        href='#'
                        className='btn btn-sm btn-light-success fw-bolder ms-2 fs-8 py-1 px-3'
                        data-bs-toggle='modal'
                        data-bs-target='#kt_modal_upgrade_plan'
                      >
                        {user?.position}
                      </a>
                    </div>

                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                      <a
                        href='#'
                        className='d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2'
                      >
                        <KTIcon iconName='sms' className='fs-4 me-1' />
                        {user?.email ?? '-'}
                      </a>
                      <a
                        href='#'
                        className={`d-flex align-items-center text-hover-primary mb-2 ${getAttendanceColor()}`}
                      >
                        <KTIcon iconName='time' className='fs-4 me-1' />
                        Status: {getAttendanceStatus()}
                      </a>
                    </div>
                  </div>

                  <div className='d-flex my-4'>
                    <button
                      type='button'
                      className='btn btn-sm btn-primary me-2'
                      onClick={() => handleClockIn()}
                      disabled={!user || isClockInLoading}
                    >
                      <span className='indicator-label'>{isClockInLoading ? 'Clocking In...' : 'Clock-In'}</span>
                    </button>
                    <button
                      type='button'
                      className='btn btn-sm btn-secondary me-2'
                      onClick={() => handleClockOut()}
                      disabled={!user || isClockOutLoading}
                    >
                      <span className='indicator-label'>{isClockOutLoading ? 'Clocking Out...' : 'Clock-Out'}</span>
                    </button>
                  </div>
                </div>

                <div className='d-flex flex-wrap flex-stack'>
                  <div className='d-flex flex-column flex-grow-1 pe-8'>
                    <div className='d-flex flex-wrap'>
                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <div className='fs-2 fw-bolder'>4500$</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-500'>Total Work Day</div>
                      </div>

                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <div className='fs-2 fw-bolder'>75</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-500'>Total In</div>
                      </div>

                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <div className='fs-2 fw-bolder'>60%</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-500'>Total Alpha</div>
                      </div>

                      <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                        <div className='d-flex align-items-center'>
                          <div className='fs-2 fw-bolder'>60%</div>
                        </div>

                        <div className='fw-bold fs-6 text-gray-500'>Total Late</div>
                      </div>
                    </div>
                  </div>

                  <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                    <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                      <span className='fw-bold fs-6 mb-3 text-gray-500'>Office Hours (08:00 - 18:00)</span>
                      <span className='fw-bolder fs-6'>{Math.round(progressPct)}%</span>
                    </div>
                    <div className='position-relative h-5px mx-3 w-100 bg-light mb-3'>
                      {/* Progress bar */}
                      <div
                        className='bg-success rounded h-5px'
                        role='progressbar'
                        style={{ width: `${progressPct}%` }}
                      />

                      {/* Duration since clock-in - top label */}
                      {firstIn && (
                        <div
                          className='position-absolute'
                          style={{ left: `${clamp(progressPct, (inMarkerPct ?? 0), 100)}%`, top: -21, transform: 'translateX(-50%)' }}
                        >
                          <span className='badge badge-light text-muted fs-9'>Work Time: {formatDuration(elapsedFromInMs)}</span>
                        </div>
                      )}

                      {/* Clock-in marker */}
                      {inMarkerPct !== null && (
                        <div
                          className='position-absolute top-50 translate-middle-y text-center'
                          style={{ left: `${inMarkerPct}%` }}
                        >
                          <div className='bg-primary' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-trigger='hover'
                            title='Time in' style={{ width: 2, height: 12, borderRadius: 1 }} />
                          <div className='mt-1 text-gray-500' style={{ fontSize: 10 }}>{formatTime(eventTime(firstIn!))}</div>
                        </div>
                      )}

                      {/* Clock-out marker */}
                      {outMarkerPct !== null && (
                        <div
                          className='position-absolute top-50 translate-middle-y text-center'
                          style={{ left: `${outMarkerPct}%` }}
                        >
                          <div className='bg-secondary' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-trigger='hover'
                            title='Time out' style={{ width: 2, height: 12, borderRadius: 1 }} />
                          <div className='mt-1 text-gray-500' style={{ fontSize: 10 }}>{formatTime(eventTime(lastOut!))}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='d-flex overflow-auto h-55px'>
              <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (isOverview && 'active')
                    }
                    to='/account/overview'
                  >
                    Overview
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (isSettings && 'active')
                    }
                    to='/account/settings'
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Content>
    </>
  )
}

export { AccountHeader }