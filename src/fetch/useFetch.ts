import { useEffect, useState } from "react"
import { createUseFetchStore } from "./fetchStore"

interface UseFetchParams<TResponse, TError> {
  fetchFn: () => Promise<TResponse>
  onError?: (error: TError) => void
  onSuccess?: (data: TResponse) => void
}

const useFetch = <TResponse, TError = Error>({
  fetchFn,
  onError,
  onSuccess,
}: UseFetchParams<TResponse, TError>) => {
  const [useStore, _] = useState(() => createUseFetchStore<TResponse, TError>())

  const store = useStore()

  useEffect(() => {
    onError && store.error && onError(store.error)
    onSuccess && store.data && onSuccess(store.data)
  }, [store.status])

  useEffect(() => {
    store.fetchData(fetchFn)
  }, [])

  return store
}

export default useFetch
