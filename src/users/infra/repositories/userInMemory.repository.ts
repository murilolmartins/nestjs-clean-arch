import { ConflictError } from '@/shared/domain/errors/conflict.error'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'
import { InMemorySearchbleRepository } from '@/shared/domain/repositories/in-memory-searchble-repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
    extends InMemorySearchbleRepository<UserEntity>
    implements UserRepository
{
    constructor() {
        super()
    }
    async findByEmail(email: string): Promise<UserEntity> {
        const user = this.entities.find(user => user.email === email)

        if (!user) {
            throw new NotFoundError('User not found')
        }

        return user
    }

    async emailExists(email: string): Promise<void> {
        const user = await this.findByEmail(email)

        if (user) {
            throw new ConflictError('Email already exists')
        }
    }
}
