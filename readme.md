# Well Rested

Rest well knowing your REST API is correctly typed!

`well-rested` is a typescript package which lets you define input and output types for REST APIs, and then checks that all requests made matches said types.

## Features

* Allows fully defining input (http parameter, and request body) types as well as response types, per endpoint.
* Checks that endpoint exists when type-checking request, in some cases the type system may even be able to figure out the possible endpoints for usage in e.g. completion.
* Checks that all needed arguments are given and are of the right type when checking a request.
* Gives information about return type when checking a request.
* Lightweight with zero runtime dependencies, leveraging portable builtin functions and asynchronus requests.
* Gives complete Response object if HTTP request fails, for flexibility and error inspection.

## Usage

### Installation

```sh
npm i well-rested
```

### Usage

In order to define an API you simply define a type which extends the `APIDef` interface, and create an instance of the `API` class using it as a generic argument.

`API.ts`
```typescript
import { API } from 'well-rested'

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

export const myApi = new API<MyAPI>("http://localhost:8000")
export default myApi
```

You can then make requests in other files as such
`foo.ts`
```typescript
import { myApi } from './API.js'

const barResponse : { name: string } | Response = await myApi.get("/foo/bar", {
  query: { id: 5 }
})

console.log(barResponse)

const dateResponse : { date: string } | Response = await myApi.get("/foo/time", {})

console.log(dateResponse)

const loginResponse : { accessToken: string } | { error: string } | Response = await myApi.post("/foo/login", {
  request: { user: { name: "bunger", password: "cat" } } 
})

console.log(loginResponse)

const postResponse : { result: string } | { error: string } | Response = await myApi.post("/foo/post", { 
  query: { postid: 42 },
  request: { accessToken: "so_secret" } 
})

console.log(postResponse)
```

this example was taken from `tests/index.ts`

### Quirks

If you try to use a non-exitsing endpoint, or try to post a get endpoint or vice versa you will get an error like `Argemunt of type '...' is not assignable to parameter of type 'never'`, this is intentional and stops you from missusing endpoints.
