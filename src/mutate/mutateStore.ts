import { create } from "zustand"

type mutateData<TResponse, TError> = (
  mutateFn: () => Promise<TResponse>,
  onSuccess?: (data: TResponse) => void,
  onError?: (error: TError) => void
) => Promise<void>

interface StoreState<TResponse, TError> {
  data: TResponse | null
  error: TError | null
  status: "idle" | "loading" | "success" | "error"
  isSettled: boolean
  mutateData: mutateData<TResponse, TError>
}

export const createUseMutateStore = <TResponse, TError>() =>
  create<StoreState<TResponse, TError>>((set) => ({
    data: null,
    error: null,
    status: "idle",
    isSettled: false,
    mutateData: async (mutateFn, onSuccess, onError) => {
      set({ status: "loading", data: null, error: null, isSettled: false })
      try {
        const data = await mutateFn()
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
