import React, { useEffect, useMemo, useState } from 'react'
import { AbsenceListResponse } from '../types'
import { listAbsenceOfUser } from '../api'
import { useAuth } from '@modules/auth/context/AuthContext'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'

type Props = {
  className: string
}

const AbsenceHistory: React.FC<Props> = ({ className }) => {
  const { currentUser } = useAuth()
  // Server returns AbsenceListResponse; keep a flat array locally for rendering
  const [absenceList, setAbsenceList] = useState<AbsenceListResponse['data']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [take] = useState(10)
  const [total, setTotal] = useState(0)
  // Search functionality not implemented; removed unused state

  // Date-time range filter using Flatpickr
  const initialStart = (() => {
    const d = new Date()
    d.setDate(1) // start of current month
    d.setHours(0, 0, 0, 0)
    return d
  })()
  const initialEnd = new Date()
  const [dateRange, setDateRange] = useState<Date[]>([initialStart, initialEnd])
  // Applied range used for server-side filtering (Apply button controls when to refetch)
  const [appliedStartDate, setAppliedStartDate] = useState<string>(() => initialStart.toISOString())
  const [appliedEndDate, setAppliedEndDate] = useState<string>(() => initialEnd.toISOString())

  const fetchData = async () => {
    if (!currentUser?.id && currentUser?.id !== 0) return
    setLoading(true)
    try {
      const response = await listAbsenceOfUser(String(currentUser.id), {
        page,
        take,
        startDate: appliedStartDate,
        endDate: appliedEndDate,
      })
      // Server-side pagination response { data, meta }
      setAbsenceList(response.data.data)
      setTotal(response.data.meta?.itemCount ?? 0)
    } catch (err) {
      console.error(err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    fetchData()
    // Re-fetch when page, user, or applied date range changes
  }, [page, currentUser?.id, appliedStartDate, appliedEndDate])
  // Server-side filtering is applied; no additional client-side date filtering needed
  const filteredAbsences = useMemo(() => absenceList, [absenceList])

  const handleDateFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Apply the date filters and reset to first page to refetch
    const [start, end] = dateRange
    const startISO = start ? new Date(start).toISOString() : ''
    // If end is missing (single click), use end of start day
    let endISO = ''
    if (end) {
      endISO = new Date(end).toISOString()
    } else if (start) {
      const endOfDay = new Date(start)
      endOfDay.setHours(23, 59, 59, 999)
      endISO = endOfDay.toISOString()
    }

    setAppliedStartDate(startISO)
    setAppliedEndDate(endISO)
    setPage(1)
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header align-items-center border-0 mt-4'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold mb-2 text-gray-900'>Absence History</span>
        </h3>
        <div className='card-toolbar'>
          <form className='row g-1' onSubmit={handleDateFilter}>
            <div className='col-8'>
              <label className='form-label fw-semibold mb-1'>Date & Time Range</label>
              <Flatpickr
                options={{
                  mode: 'range',
                  enableTime: true,
                  time_24hr: true,
                  dateFormat: 'Y-m-d H:i',
                }}
                value={dateRange}
                onChange={(dates) => setDateRange(dates as Date[])}
                className='form-control'
              />
            </div>
            <div className='col-auto align-self-end'>
              <button type='submit' className='btn btn-primary'>
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-5'>
        {/* Loading / Error */}
        {error && (
          <div className='alert alert-danger py-2'>{error}</div>
        )}
        {loading && (
          <div className='text-muted mb-3'>Loading...</div>
        )}

        {/* begin::Timeline */}
        <div className='timeline-label'>
          {/* begin::Item */}
          {
            filteredAbsences.map((absence) => (
              <div className='timeline-item' key={absence.id}>
                {/* begin::Label */}
                <div className='timeline-label fw-bold text-gray-800 fs-6'>{new Date(absence.createdAt).toLocaleString()}</div>
                {/* end::Label */}
                {/* begin::Badge */}
                <div className='timeline-badge'>
                  <i className={`fa fa-genderless fs-1 ${absence.status === 'in' ? 'text-success' : 'text-danger'}`}></i>
                </div>
                {/* end::Badge */}
                {/* begin::Text */}
                <div className='fw-mormal timeline-content text-muted ps-3'>
                  {absence.status === 'in' ? 'Clocked In' : 'Clocked Out'}
                </div>
                {/* end::Text */}
              </div>
            ))
          }
        </div>
        {/* end::Timeline */}

        {/* Pagination */}
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <div className='text-muted small'>
            Showing {total ? (page - 1) * take + 1 : 0} - {Math.min(page * take, total)} of {total}
          </div>
          <div className='btn-group'>
            <button
              type='button'
              className='btn btn-sm btn-light'
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className='btn btn-sm btn-light disabled'>
              Page {page} of {Math.max(1, Math.ceil(total / take))}
            </span>
            <button
              type='button'
              className='btn btn-sm btn-light'
              disabled={page >= Math.max(1, Math.ceil(total / take)) || loading}
              onClick={() => setPage((p) => Math.min(Math.max(1, Math.ceil(total / take)), p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* end: Card Body */}
    </div>
  )
}

export { AbsenceHistory }