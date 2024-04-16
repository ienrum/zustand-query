import { useEffect, useState } from "react"
import { createUseFetchStore } from "./fetchStore"

interface UseFetchParams<TResponse, TError> {
  onFetch: () => Promise<TResponse>
  onError?: (error: TError) => void
  onSuccess?: (data: TResponse) => void
}

const useFetch = <TResponse, TError = Error>({
  onFetch,
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
    store.fetchData(onFetch)
  }, [])

  return store
}

export default useFetch
