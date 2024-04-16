import { http, HttpResponse } from "msw"
import { testDatas as datas } from "../tests/fetch/store.test"

interface requestUser {
  name: string
}

export const handlers = [
  http.get("/user/:id", ({ params }) => {
    const data = datas.find((item) => item.id === Number(params.id))

    if (!data) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 })
    }
    return HttpResponse.json(data)
  }),
  http.get("/error", () => {
    return HttpResponse.error()
  }),

  http.post("/error", () => {
    return HttpResponse.error()
  }),

  http.post("/user", async ({ request }) => {
    const newUser = (await request.json()) as requestUser
    datas.push({ id: datas.length + 1, name: newUser.name })

    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.put("/user/:id", async ({ params, request }) => {
    const data = datas.find((item) => item.id === Number(params.id))
    if (!data) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updatedUser = (await request.json()) as requestUser
    datas[datas.indexOf(data)] = { id: data.id, name: updatedUser.name }

    return HttpResponse.json(updatedUser, { status: 200 })
  }),

  http.delete("/user/:id", ({ params }) => {
    const data = datas.find((item) => item.id === Number(params.id))
    if (!data) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 })
    }

    datas.splice(datas.indexOf(data), 1)
    return HttpResponse.json(data, { status: 200 })
  }),
]
