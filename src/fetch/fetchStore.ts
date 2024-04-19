import { create } from "zustand"
import { StoreStateType } from "../state"

type FetchData<TResponse, TError> = (
  fetchFn: () => Promise<TResponse>,
  onSuccess?: (data: TResponse) => void,
  onError?: (error: TError) => void
) => Promise<void>

interface StoreActionType<TResponse, TError> {
  fetchData: FetchData<TResponse, TError>
}

type StoreType<TResponse, TError> = StoreStateType<TResponse, TError> &
  StoreActionType<TResponse, TError>

export const createUseFetchStore = <TResponse, TError>() =>
  create<StoreType<TResponse, TError>>((set) => ({
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
