import { type HttpResponse, type HttpRequest } from './http'

export interface Controller {
    handle: (request: HttpRequest) => Promise<HttpResponse>
}
