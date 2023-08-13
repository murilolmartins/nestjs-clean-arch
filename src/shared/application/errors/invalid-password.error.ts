export class InvalidPasswordError extends Error {
    statusCode = 401
    constructor() {
        super('Invalid password')
        this.name = 'InvalidPasswordError'
    }
}
