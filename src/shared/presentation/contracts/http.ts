export interface HttpRequest<TBody = any, TParams = any> {
    body: TBody
    params?: TParams
}

export interface HttpResponse<T = any> {
    statusCode: number
    body: T
    message?: string
    error: string
}

export interface HttpError {
    message: string
    error?: string
}

export const error = (
    error: Error,
    statusCode: number,
): HttpResponse<null> => ({
    statusCode,
    body: null,
    error: error.name,
    message: error.message,
})

export const ok = <T>(data: T, statusCode: number): HttpResponse<T> => ({
    statusCode,
    body: data,
    error: null,
})

export const serverError = (error: Error): HttpResponse<null> => ({
    statusCode: 500,
    message: error.message,
    error: 'Internal Server Error',
    body: null,
})
