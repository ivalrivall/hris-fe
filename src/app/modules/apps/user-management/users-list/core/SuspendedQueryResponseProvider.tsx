/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from '@tanstack/react-query'
import {
  createResponseContext,
  initialQueryResponse,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
  User
} from '../../../../../../_metronic/helpers'
import {getUsers} from './_requests'
import {useSuspendedQueryRequest} from './SuspendedQueryRequestProvider'

const SuspendedQueryResponseContext = createResponseContext<User>(initialQueryResponse)
const SuspendedQueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useSuspendedQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery)
    }
  }, [updatedQuery])

  const { isFetching, refetch, data: response } = useQuery({
    queryKey: [`${QUERIES.USERS_LIST}-${query}`],
    queryFn: () => getUsers(query),
    refetchOnWindowFocus: false,
  });

  return (
    <SuspendedQueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </SuspendedQueryResponseContext.Provider>
  )
}

const useSuspendedQueryResponse = () => useContext(SuspendedQueryResponseContext)

const useSuspendedQueryResponseData = () => {
  const {response} = useSuspendedQueryResponse()
  if (!response) {
    return []
  }

  return response?.data || []
}

const useSuspendedQueryResponsePagination = () => {
  const {response} = useSuspendedQueryResponse()
  if (!response || !response.payload || !response.payload.pagination) {
    return {
      links: [],
      page: 1,
      size: 10,
      total: 0,
      skip: 0
    }
  }

  return response.payload.pagination
}

const useSuspendedQueryResponseLoading = (): boolean => {
  const {isLoading} = useSuspendedQueryResponse()
  return isLoading
}

export {
  SuspendedQueryResponseProvider,
  useSuspendedQueryResponse,
  useSuspendedQueryResponseData,
  useSuspendedQueryResponsePagination,
  useSuspendedQueryResponseLoading,
}