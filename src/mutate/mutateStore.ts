import { create } from "zustand"
import { StoreStateType } from "../state"

type mutateData<TResponse, TError> = (
  mutateFn: () => Promise<TResponse>,
  onSuccess?: (data: TResponse) => void,
  onError?: (error: TError) => void
) => Promise<void>

interface StoreActionType<TResponse, TError> {
  mutateData: mutateData<TResponse, TError>
}

type StoreType<TResponse, TError> = StoreStateType<TResponse, TError> &
  StoreActionType<TResponse, TError>

export const createUseMutateStore = <TResponse, TError>() =>
  create<StoreType<TResponse, TError>>((set) => ({
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
