import { create } from "zustand"

interface StoreState<TResponse, TError> {
  data: TResponse | null
  error: TError | null
  status: "idle" | "loading" | "success" | "error"
  isSettled: boolean
  fetchData: (fetchFn: () => Promise<TResponse>) => Promise<void>
}

export const createUseFetchStore = <TResponse, TError>() =>
  create<StoreState<TResponse, TError>>((set) => ({
    data: null,
    error: null,
    status: "idle",
    isSettled: false,
    fetchData: async (fetchFn) => {
      set({ status: "loading", data: null, error: null, isSettled: false })
      try {
        const data = await fetchFn()
        set({ status: "success", data })
      } catch (error) {
        set({ status: "error", error: error as TError })
      } finally {
        set({ isSettled: true })
      }
    },
  }))
