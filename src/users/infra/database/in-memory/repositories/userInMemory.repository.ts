import { left, right } from '@/shared/domain/contracts/either'
import { ConflictError } from '@/shared/domain/errors/conflict.error'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'
import { InMemorySearchbleRepository } from '@/shared/domain/repositories/in-memory-searchble-repository'
import {
    SortDirection,
    SortDirectionEnum,
} from '@/shared/domain/repositories/searchble-repository-contracts'
import { UserEntity } from '@/users/domain/entities/user.entity'
import {
    EmailExistsReturn,
    FindByEmailReturn,
    UserRepository,
} from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
    extends InMemorySearchbleRepository<UserEntity>
    implements UserRepository.Repository
{
    sortableFields: string[] = ['name', 'email', 'createdAt', 'updatedAt']
    constructor() {
        super()
    }
    async findByEmail(email: string): FindByEmailReturn {
        const user = this.entities.find(user => user.email === email)

        if (!user) {
            return left(new NotFoundError('User not found'))
        }

        return right(user)
    }

    async emailExists(email: string): EmailExistsReturn {
        const user = this.entities.find(user => user.email === email)

        if (user) return left(new ConflictError('Email already exists'))

        return right(null)
    }

    protected async applyFilter(
        users: UserEntity[],
        filter: UserRepository.Filter,
    ): Promise<UserEntity[]> {
        if (!filter) {
            return users
        }
        return users.filter(item => {
            return item.props.name.toLowerCase().includes(filter.toLowerCase())
        })
    }

    protected async applySort(
        items: UserEntity[],
        sort: string,
        sortDir: SortDirection,
    ): Promise<UserEntity[]> {
        return !sort
            ? super.applySort(items, 'createdAt', SortDirectionEnum.ASC)
            : super.applySort(items, sort, sortDir)
    }
}
