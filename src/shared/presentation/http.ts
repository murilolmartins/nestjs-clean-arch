export interface HttpRequest<T = any> {
    body: T
}

export interface HttpResponse<T = any> {
    statusCode: number
    body: T
}

export interface HttpError {
    message: string
}

export const error = (
    error: Error,
    statusCode: number,
): HttpResponse<HttpError> => ({
    statusCode,
    body: { message: error.message },
})

export const ok = <T>(data: T, statusCode: number): HttpResponse<T> => ({
    statusCode,
    body: data,
})
