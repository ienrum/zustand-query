import { useEffect, useState } from "react"
import { createUseMutateStore } from "./mutateStore"

interface UseFetchParams<TResponse, TError> {
  onMutate: () => Promise<TResponse>
  onError?: (error: TError) => void
  onSuccess?: (data: TResponse) => void
}

const useFetch = <TResponse, TError = Error>({
  onMutate,
  onError,
  onSuccess,
}: UseFetchParams<TResponse, TError>) => {
  const [useStore, _] = useState(() =>
    createUseMutateStore<TResponse, TError>()
  )

  const store = useStore()

  useEffect(() => {
    onError && store.error && onError(store.error)
    onSuccess && store.data && onSuccess(store.data)
  }, [store.status])

  useEffect(() => {
    store.mutateData(onMutate)
  }, [])

  return store
}

export default useFetch
