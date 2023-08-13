export class ConflictError extends Error {
    statusCode = 409
    constructor(public message: string) {
        super(message)
        this.name = 'ConflictError'
    }
}
