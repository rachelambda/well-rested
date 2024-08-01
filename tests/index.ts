import { API } from '../src/index.js'

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
  "/foo/timepost": {
    kind: "POST",
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

export const myApi = new API<MyAPI>("http://localhost:8000")
export default myApi

const barResponse : { name: string } | Response = await myApi.get("/foo/bar", {
  query: { id: 5 }
})

console.log(barResponse)

const dateResponse : { date: string } | Response = await myApi.get("/foo/time", {})

console.log(dateResponse)

const datePostResponse : { date: string } | Response = await myApi.post("/foo/timepost", {})

console.log(datePostResponse)

const loginResponse : { accessToken: string } | { error: string } | Response = await myApi.post("/foo/login", {
  request: { user: { name: "bunger", password: "cat" } } 
})

console.log(loginResponse)

const postResponse : { result: string } | { error: string } | Response = await myApi.post("/foo/post", { 
  query: { postid: 42 },
  request: { accessToken: "so_secret" } 
})

console.log(postResponse)
