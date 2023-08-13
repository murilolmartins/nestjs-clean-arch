export interface HttpRequest<TBody = any, TParams = any> {
    body: TBody
    params?: TParams
}

export interface HttpResponse<T = any> {
    statusCode: number
    body: T
}

export interface HttpError {
    message: string
    error?: string
}

export const error = (
    error: Error,
    statusCode: number,
): HttpResponse<HttpError> => ({
    statusCode,
    body: { message: error.message, error: error.name },
})

export const ok = <T>(data: T, statusCode: number): HttpResponse<T> => ({
    statusCode,
    body: data,
})

export const serverError = (error: Error): HttpResponse<HttpError> => ({
    statusCode: 500,
    body: { message: error.message },
})
