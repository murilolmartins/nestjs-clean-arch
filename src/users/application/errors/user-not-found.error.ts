import { NotFoundError } from '@/shared/domain/errors/not-found.error'

export class UserNotFoundError extends NotFoundError {
    constructor(field: string, value: string) {
        super(`User not found with ${field}: ${value}`)
        this.name = 'UserNotFoundError'
    }
}
