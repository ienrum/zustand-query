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
import useFetch from "../../src/fetch/useFetch"

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

describe("fetchData", () => {
  it("should fetch data successfully", async () => {
    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: async () => await axios.get<TestDatas>("/user/1"),
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(result.current.data?.data).toMatchObject(testDatas[0])
    expect(result.current.error).toBeNull()
    expect(result.current.status).toBe("success")
  })

  it("should handle a server error", async () => {
    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: async () => await axios.get<TestDatas>("/user/3"),
      })
    )
    await waitFor(() => result.current.isSettled)

    expect(result.current.error).not.toBeNull()
    expect(result.current.status).toBe("error")
  })

  it("should handle a network error", async () => {
    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: async () => await axios.get<TestDatas>("/error"),
      })
    )
    await waitFor(() => result.current.isSettled)

    expect(result.current.error).toBeDefined()
    expect(result.current.status).toBe("error")
  })
})

describe("config store", () => {
  it("should be success by fetch api", async () => {
    const fetchUser1 = async () => await fetch("/user/1")

    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: fetchUser1,
      })
    )
    await waitFor(() => result.current.isSettled)

    expect(await result.current.data?.json()).toMatchObject(testDatas[0])
    expect(result.current.status).toBe("success")
    expect(result.current.error).toBeNull()
  })

  it("should be success by axios api", async () => {
    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: async () => await axios.get<TestDatas>("/user/2"),
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(result.current.data?.data).toMatchObject(testDatas[1])
    expect(result.current.status).toBe("success")
    expect(result.current.error).toBeNull()
  })

  it("should be error by fetch api", async () => {
    const fetchUser3 = async () => await fetch("/user/3")

    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: fetchUser3,
      })
    )

    await waitFor(() => result.current.isSettled)

    expect(result.current.data?.ok).toBe(false)
  })
})

describe("onSuccess and onError", () => {
  it("should call onSuccess", async () => {
    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: async () => await axios.get<TestDatas>("/user/1"),
        onSuccess: (data) => console.info(data),
      })
    )

    const consoleSpy = vi.spyOn(console, "info")

    await waitFor(() => result.current.isSettled)

    expect(consoleSpy).toHaveBeenCalled()
    expect(result.current.data?.data).toMatchObject(testDatas[0])

    consoleSpy.mockRestore()
  })

  it("should call onError", async () => {
    const { result, waitFor } = renderHook(() =>
      useFetch({
        onFetch: async () => await axios.get<TestDatas>("/user/3"),
        onError: (error: AxiosError) => console.info(error),
      })
    )
    const consoleSpy = vi.spyOn(console, "info")

    await waitFor(() => result.current.isSettled)

    expect(consoleSpy).toHaveBeenCalled()
    expect(result.current.error).toBeDefined()

    consoleSpy.mockRestore()
  })
})
