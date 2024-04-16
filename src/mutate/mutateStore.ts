import { create } from "zustand"

interface StoreState<TResponse, TError> {
  data: TResponse | null
  error: TError | null
  status: "idle" | "loading" | "success" | "error"
  isSettled: boolean
  mutateData: (mutateFn: () => Promise<TResponse>) => Promise<void>
}

export const createUseMutateStore = <TResponse, TError>() =>
  create<StoreState<TResponse, TError>>((set) => ({
    data: null,
    error: null,
    status: "idle",
    isSettled: false,
    mutateData: async (mutateFn) => {
      set({ status: "loading", data: null, error: null, isSettled: false })
      try {
        const data = await mutateFn()
        set({ status: "success", data })
      } catch (error) {
        set({ status: "error", error: error as TError })
      } finally {
        set({ isSettled: true })
      }
    },
  }))
