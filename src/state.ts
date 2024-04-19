interface IdleState {
  status: "idle"
  data: null
  error: null
  isSettled: false
}

interface LoadingState {
  status: "loading"
  data: null
  error: null
  isSettled: false
}

interface SuccessState<TResponse> {
  status: "success"
  data: TResponse
  error: null
  isSettled: true
}

interface ErrorState<TError> {
  status: "error"
  data: null
  error: TError
  isSettled: true
}

export type StoreStateType<TResponse, TError> =
  | IdleState
  | LoadingState
  | SuccessState<TResponse>
  | ErrorState<TError>
