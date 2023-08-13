export class NotFoundError extends Error {
    statusCode = 404
    constructor(public message: string) {
        super(message)
        this.name = 'NotFoundError'
    }
}
