import { AbsenceListResponse, listAbsenceQuery } from './types/dashboard.types'
import http from '../../services/http'

const ENDPOINTS = {
    absence: '/v1/absences',
} as const

export function listAbsence(id: string, query: listAbsenceQuery) {
    return http.get<AbsenceListResponse>(`${ENDPOINTS.absence}`, { params: query })
}
