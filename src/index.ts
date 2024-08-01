export interface QueryParams {
  [key: string]: (string | number)
}

export interface APIDef {
  [key: string]: ({
    kind: "POST",
    query?: QueryParams,
    request?: Object,
    response: Object,
  } | {
    kind: "GET",
    query?: QueryParams,
    response: Object,
  })
}

export type ValidEndPointFor<M extends "GET" | "POST", T, U extends keyof T, V> 
  = T[U] extends { kind: M } ? V : never

export class API<T extends APIDef> {

  private readonly base: string;

  constructor(base: (`http://${string}`) | (`https://${string}`)) {
    this.base = base;
  }

  private async dispatch<ep extends keyof T & string>(method: "POST" | "GET", 
         endpoint: ep,
         req: { query?: QueryParams, request?: Object }): Promise<T[ep]["response"] | Response> {

    let url : URL = new URL(endpoint, this.base)
    let opts : RequestInit = { method }

    if (req.query != null) {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(req.query)) {
        params.set(key, typeof(value) == "string" ? value : value.toString())
      }
      url = new URL("?" + params.toString(), url)
    }

    if (method == "POST" && req.request != null) {
      opts.body = JSON.stringify(req.request)
      opts.headers = { "Content-Type": "application/json" }
    }

    let response = await fetch(url, opts)

    if (!response.ok) {
      return response
    }

    return response.json()
  }

  async get<endpoint extends string, 
            reqtype extends ValidEndPointFor<"GET", T, endpoint, ("query" extends keyof T[endpoint] ? { query: T[endpoint]["query"] } : {})>>
              (ep : endpoint, req: reqtype): Promise<T[endpoint]["response"] | Response> {
    return this.dispatch("GET", ep, req as { query?: QueryParams })
  }

  async post<endpoint extends (string & keyof T), 
            
            reqtype extends ValidEndPointFor<"POST", T, endpoint, ("query" extends T[endpoint] ? { query: T[endpoint]["query"] } : {})
                          & (T[endpoint] extends { request?: Object } ? ("request" extends keyof T[endpoint] ? { request: T[endpoint]["request"] } : {}) : never)>>
                (ep : endpoint, req: reqtype): Promise<T[endpoint]["response"] | Response> {
    return this.dispatch("POST", ep, req as { query?: QueryParams, request?: Object })
  }
}
