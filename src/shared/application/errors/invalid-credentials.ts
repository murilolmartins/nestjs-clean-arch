export class InvalidCredentialsError extends Error {
    statusCode = 401
    constructor() {
        super('Invalid credentials')
        this.name = 'InvalidCredentialsError'
    }
}
