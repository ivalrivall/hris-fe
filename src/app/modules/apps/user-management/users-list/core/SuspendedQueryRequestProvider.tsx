/* eslint-disable react-refresh/only-export-components */
import {FC, useState, createContext, useContext, useEffect} from 'react'
import {
  QueryState,
  QueryRequestContextProps,
  initialQueryRequest,
  WithChildren,
} from '../../../../../../_metronic/helpers'

const SuspendedQueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest)

const SuspendedQueryRequestProvider: FC<WithChildren> = ({children}) => {
  const [state, setState] = useState<QueryState>(initialQueryRequest.state)

  const updateState = (updates: Partial<QueryState>) => {
    const updatedState = {...state, ...updates} as QueryState
    setState(updatedState)
  }

  // Set default filter for suspended users
  useEffect(() => {
    updateState({
      ...state,
      filter: {
        ...state.filter,
        status: 'suspended'
      }
    })
  }, [])

  return (
    <SuspendedQueryRequestContext.Provider value={{state, updateState}}>
      {children}
    </SuspendedQueryRequestContext.Provider>
  )
}

const useSuspendedQueryRequest = () => useContext(SuspendedQueryRequestContext)
export {SuspendedQueryRequestProvider, useSuspendedQueryRequest}