import { AbsenceModel } from './types/absence.types'
import http from '../../services/http'

const ENDPOINTS = {
    absence: '/v1/absences',
    todayAbsence: '/v1/absences/today/me',
} as const

export function storeAbsence(status: string) {
    return http.post<{ status: string }>(
        ENDPOINTS.absence,
        { status }
    )
}

export function updateAbsence(status: string) {
    return http.put<{ status: boolean }>(ENDPOINTS.absence, { status })
}

export function listAbsence() {
    return http.get<AbsenceModel[]>(ENDPOINTS.absence)
}

export function getTodayAbsence() {
    return http.get<AbsenceModel[]>(ENDPOINTS.todayAbsence)
}
