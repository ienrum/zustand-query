import { renderHook } from "@testing-library/react-hooks"
import { server } from "../../mock/node"
import {
  afterEach,
  describe,
  expect,
  beforeAll,
  afterAll,
  it,
  vi,
} from "vitest"
import axios, { AxiosError } from "axios"
import useMutate from "../../src/mutate/useMutate"

// Define test data, (this could be an API response)
interface TestDatas {
  id: number
  name: string
}

export const testDatas: TestDatas[] = [
  { id: 1, name: "Test User 1" },
  { id: 2, name: "Test User 2" },
]

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("mutateData", () => {
  it("should post data successfully", async () => {
    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: () =>
          axios.post("/user", {
            name: "John Doe",
          }),
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(result.current.data?.status === 201).toBeTruthy()
    expect(result.current.error).toBeNull()
    expect(result.current.status).toBe("success")
  })

  it("should handle a server error", async () => {
    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: () => axios.post("/incorrect-path", { name: "John Doe" }),
      })
    )
    await waitFor(() => result.current.isSettled)

    expect(result.current.error).not.toBeNull()
    expect(result.current.status).toBe("error")
  })

  it("should handle a network error", async () => {
    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: () => axios.post("/error", { name: "John Doe" }),
      })
    )
    await waitFor(() => result.current.isSettled)

    expect(result.current.error).toBeDefined()
    expect(result.current.status).toBe("error")
  })
})

describe("axios and fetch tests", () => {
  it("should be success by fetch api", async () => {
    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: () => {
          const response = fetch("/user", {
            method: "POST",
            body: JSON.stringify({ name: "John Doe" }),
          })

          return response
        },
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(result.current.data?.status === 201).toBeTruthy()
    expect(result.current.error).toBeNull()
    expect(result.current.status).toBe("success")
  })

  it("should be success by axios api", async () => {
    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: () => axios.post("/user", { name: "John Doe" }),
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(result.current.data?.status === 201).toBeTruthy()
    expect(result.current.status).toBe("success")
    expect(result.current.error).toBeNull()
  })

  it("should be error by fetch api", async () => {
    const fetchUser3 = () =>
      fetch("/invalid-path", {
        method: "POST",
        body: JSON.stringify({ name: "John Doe" }),
      })

    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: fetchUser3,
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(result.current.status).toBe("error")
  })
})

describe("onSuccess and onError", () => {
  it("should call onSuccess", async () => {
    const mockFn = vi.fn()

    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: () => axios.post("/user", { name: "John Doe" }),
        onSuccess: (data) => mockFn(),
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(mockFn).toHaveBeenCalled()
    expect(result.current.error).toBeDefined()

    mockFn.mockRestore()
  })

  it("should call onError", async () => {
    const mockFn = vi.fn()

    const { result, waitFor } = renderHook(() =>
      useMutate({
        onMutate: () => axios.post("/invalid-path", { name: "John Doe" }),
        onError: (error: AxiosError) => mockFn(),
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(mockFn).toHaveBeenCalled()
    expect(result.current.error).toBeDefined()

    mockFn.mockRestore()
  })
})
