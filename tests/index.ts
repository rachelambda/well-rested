import { API } from '../src/index.ts'

// Expample API with two endpoints
type MyAPI = {
  "/foo/bar": {
    kind: "GET",
    query:    { id : number },
    response: { name: string },
  },
  "/foo/time": {
    kind: "GET",
    response: { date: string },
  },
  "/foo/login": {
    kind: "POST",
    request:  { user: { name: string, password: string } },
    response: { accessToken: string } | { error: string },
  },
  "/foo/post": {
    kind: "POST",
    query: { postid: number },
    request:  { accessToken: string },
    response: { result: string } | { error: string },
  },
}

const myApi = new API<MyAPI>("https://myservice.test")

const barResponse : Promise<{ name: string } | Response> = myApi.get("/foo/bar", {
  query: { id: 5 }
})

const dateResponse : Promise<{ date: string } | Response> = myApi.get("/foo/time", {})

const loginResponse : Promise<{ accessToken: string } | { error: string } | Response> = myApi.post("/foo/login", {
  request: { user: { name: "bunger", password: "cat" } } 
})

const postResponse : Promise<{ result: string } | { error: string } | Response> = myApi.post("/foo/post", { 
  query: { postid: 42 },
  request: { accessToken: "so_secret" } 
})
