import { AxiosResponse } from 'axios'
import { Response, ID } from '@metronic/helpers'
import { parseRequestQuery, QueryState } from '@metronic/helpers/crud-helper/helpers'
import { User } from './_models'
import { listUser } from '../api'
import { UserModel, UserListResponse, listUserQuery } from '../types'

// Map QueryState from Metronic helpers to our backend listUserQuery
function mapQueryToApi(state: QueryState): listUserQuery {
  const order = state.order ? (state.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') : undefined
  return {
    page: state.page,
    take: state.items_per_page,
    order,
    q: state.search,
    // startDate/endDate can be added here if present in state.filter
  }
}

// Normalize backend pagination meta to Metronic PaginationState with minimal links
function buildPagination(meta: UserListResponse['meta'], fallback: QueryState) {
  const currentPage = meta.page ?? fallback.page ?? 1
  const take = meta.take ?? fallback.items_per_page ?? 10
  const allowed = [10, 30, 50, 100] as const
  const items_per_page = (allowed as readonly number[]).includes(take) ? (take as 10 | 30 | 50 | 100) : 10

  const links = [
    { label: '&laquo; Previous', active: false, url: null, page: meta.hasPreviousPage ? currentPage - 1 : null },
    { label: String(currentPage), active: true, url: null, page: currentPage },
    { label: 'Next &raquo;', active: false, url: null, page: meta.hasNextPage ? currentPage + 1 : null },
  ]

  return { page: currentPage, items_per_page, links }
}

// Fetch users using the new API and adapt to Metronic Response shape used by providers
const getUsers = async (query: string): Promise<Response<Array<UserModel>>> => {
  const state = parseRequestQuery(query) as QueryState
  const params = mapQueryToApi(state)
  const resp: AxiosResponse<UserListResponse> = await listUser(params)
  const { data, meta } = resp.data
  return {
    data, // keep API's UserModel[]; table maps it to core User later
    payload: {
      pagination: buildPagination(meta, state),
    },
  }
}

import { createUser as apiCreateUser, getUserById as apiGetUserById, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '../api'

// Map API UserModel to core User shape used by forms/UI
function mapToCoreUser(u: UserModel): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    position: u.position,
    role: typeof u.role === 'string' ? u.role : String(u.role),
    // Optional fields not provided by API remain undefined and will be filled by initialUser where needed
  }
}

// The following functions now use the real API
const getUserById = async (_id: ID): Promise<User | undefined> => {
  if (_id == null) return undefined
  const id = String(_id)
  const resp = await apiGetUserById(id)
  // API shape: direct UserModel
  return mapToCoreUser(resp.data)
}

const createUser = async (_user: User): Promise<User | undefined> => {
  if (!_user.email || !_user.name || !_user.position) return undefined
  const password = _user.password || ''
  const password_confirmation = password || ''
  const resp = await apiCreateUser(_user.email, _user.name, _user.position, password, password_confirmation)
  // Some backends return created user; if not, simply return minimal core user
  const created = (resp.data as any)?.user as UserModel | undefined
  return created ? mapToCoreUser(created) : { id: undefined, ..._user }
}

const updateUser = async (_user: User): Promise<User | undefined> => {
  if (!_user.id) return undefined
  const id = String(_user.id)
  const payload: any = {
    name: _user.name,
    email: _user.email,
    position: _user.position,
    role: _user.role,
  }
  if (_user.password) {
    payload.password = _user.password
    payload.password_confirmation = _user.password
  }
  const resp = await apiUpdateUser(id, payload)
  const updated = (resp.data as any)?.user as UserModel | undefined
  return updated ? mapToCoreUser(updated) : { ..._user }
}

const deleteUser = async (_userId: ID): Promise<void> => {
  if (_userId == null) return
  const id = String(_userId)
  await apiDeleteUser(id)
}

export { getUsers, deleteUser, getUserById, createUser, updateUser }