import { create } from "zustand"

type FetchData<TResponse, TError> = (
  fetchFn: () => Promise<TResponse>,
  onSuccess?: (data: TResponse) => void,
  onError?: (error: TError) => void
) => Promise<void>

interface StoreState<TResponse, TError> {
  data: TResponse | null
  error: TError | null
  status: "idle" | "loading" | "success" | "error"
  isSettled: boolean
  fetchData: FetchData<TResponse, TError>
}

export const createUseFetchStore = <TResponse, TError>() =>
  create<StoreState<TResponse, TError>>((set) => ({
    data: null,
    error: null,
    status: "idle",
    isSettled: false,
    fetchData: async (fetchFn, onSuccess, onError) => {
      set({ status: "loading", data: null, error: null, isSettled: false })
      try {
        const data = await fetchFn()
        set({ status: "success", data })
        onSuccess && onSuccess(data)
      } catch (error) {
        set({ status: "error", error: error as TError })
        onError && onError(error as TError)
      } finally {
        set({ isSettled: true })
      }
    },
  }))
