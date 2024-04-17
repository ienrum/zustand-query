import { useEffect, useState } from "react"
import { createUseMutateStore } from "./mutateStore"

interface UseFetchParams<TData, TResponse, TError> {
  onMutate?: () => Promise<TResponse>
  onError?: (error: TError) => void
  onSuccess?: (data: TResponse) => void
  mutateFn?: (data: TData) => Promise<TResponse>
}

const useFetch = <TData = void, TResponse = any, TError = Error>({
  onMutate,
  onError,
  onSuccess,
  mutateFn,
}: UseFetchParams<TData, TResponse, TError>) => {
  const [useStore, _] = useState(() =>
    createUseMutateStore<TResponse, TError>()
  )

  const store = useStore()

  useEffect(() => {
    onError && store.error && onError(store.error)
    onSuccess && store.data && onSuccess(store.data)
  }, [store.status])

  useEffect(() => {
    onMutate && store.mutateData(onMutate)
  }, [])

  const mutate = (
    data: TData,
    onError?: (error: TError) => void,
    onSuccess?: (data: TResponse) => void
  ) => {
    if (mutateFn) {
      store.mutateData(() => mutateFn(data))
      onError && store.error && onError(store.error)
      onSuccess && store.data && onSuccess(store.data)
    }
  }

  return { ...store, mutate }
}

export default useFetch
