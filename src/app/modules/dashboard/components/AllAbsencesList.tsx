import React, { useEffect, useMemo, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { listAbsence } from '../api'

// Local type matching the provided API response for all users
// This is read-only and tailored to the server payload
interface AllAbsenceItem {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
  status: 'in' | 'out'
  userName: string
  userPosition: string
}

interface AllAbsenceListResponse {
  data: AllAbsenceItem[]
  meta: {
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
    page: number
    take: number
  }
}

type Props = {
  className?: string
  title?: string
}

const AllAbsencesList: React.FC<Props> = ({ className = '', title = 'All Users Absences' }) => {
  const [items, setItems] = useState<AllAbsenceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [take, setTake] = useState(10)
  const [total, setTotal] = useState(0)

  // Date-time range filter
  const initialStart = (() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  })()
  const initialEnd = new Date()
  const [dateRange, setDateRange] = useState<Date[]>([initialStart, initialEnd])
  const [appliedStartDate, setAppliedStartDate] = useState<string>(() => initialStart.toISOString())
  const [appliedEndDate, setAppliedEndDate] = useState<string>(() => initialEnd.toISOString())

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / take)), [total, take])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // listAbsence signature includes an unused id param; pass empty string
      const response = await listAbsence('', {
        page,
        take,
        startDate: appliedStartDate,
        endDate: appliedEndDate,
      })
      const payload = response.data as unknown as AllAbsenceListResponse
      setItems(payload.data || [])
      setTotal(payload.meta?.itemCount ?? 0)
    } catch (err) {
      console.error(err)
      setError('Failed to load absences')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, take, appliedStartDate, appliedEndDate])

  const handleApplyFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const [start, end] = dateRange
    const startISO = start ? new Date(start).toISOString() : ''
    let endISO = ''
    if (end) endISO = new Date(end).toISOString()
    else if (start) {
      const eod = new Date(start)
      eod.setHours(23, 59, 59, 999)
      endISO = eod.toISOString()
    }
    setAppliedStartDate(startISO)
    setAppliedEndDate(endISO)
    setPage(1)
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-header align-items-center border-0 mt-4'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold mb-2 text-gray-900'>{title}</span>
        </h3>
        <div className='card-toolbar'>
          <form className='row g-1' onSubmit={handleApplyFilter}>
            <div className='col-12 col-md-8'>
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
            <div className='col-12 col-md-auto align-self-end'>
              <button type='submit' className='btn btn-primary w-100'>
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className='card-body pt-5'>
        {error && <div className='alert alert-danger py-2'>{error}</div>}
        {loading && <div className='text-muted mb-3'>Loading...</div>}

        {!loading && items.length === 0 && (
          <div className='text-center text-muted py-10'>No absences found</div>
        )}

        {items.length > 0 && (
          <>
            {/* Desktop/tablet table */}
            <div className='table-responsive d-none d-sm-block'>
              <table className='table align-middle table-row-dashed fs-6 gy-3'>
                <thead>
                  <tr className='text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0'>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody className='text-gray-600 fw-semibold'>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${item.status === 'in' ? 'badge-light-success' : 'badge-light-danger'}`}>
                          {item.status === 'in' ? 'Clocked In' : 'Clocked Out'}
                        </span>
                      </td>
                      <td>{item.userName}</td>
                      <td>{item.userPosition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className='d-block d-sm-none'>
              <div className='row g-3'>
                {items.map((item) => (
                  <div className='col-12' key={item.id}>
                    <div className='border rounded p-3'>
                      <div className='d-flex justify-content-between align-items-center mb-2'>
                        <div className='fw-bold'>{item.userName}</div>
                        <span className={`badge ${item.status === 'in' ? 'badge-light-success' : 'badge-light-danger'}`}>
                          {item.status === 'in' ? 'Clocked In' : 'Clocked Out'}
                        </span>
                      </div>
                      <div className='text-gray-700 small'>{item.userPosition}</div>
                      <div className='text-muted small mt-1'>
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        <div className='d-flex flex-wrap justify-content-between align-items-center mt-4 gap-3'>
          <div className='text-muted small'>
            Showing {total ? (page - 1) * take + 1 : 0} - {Math.min(page * take, total)} of {total}
          </div>
          <div className='d-flex align-items-center gap-3 flex-wrap'>
            <div className='input-group input-group-sm' style={{ width: 160 }}>
              <span className='input-group-text'>Per page</span>
              <select
                className='form-select form-select-sm'
                value={take}
                onChange={(e) => {
                  setTake(Number(e.target.value) || 10)
                  setPage(1)
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className='btn-group w-100 w-sm-auto'>
              <button
                type='button'
                className='btn btn-sm btn-light'
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className='btn btn-sm btn-light disabled'>
                Page {page} of {totalPages}
              </span>
              <button
                type='button'
                className='btn btn-sm btn-light'
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AllAbsencesList }