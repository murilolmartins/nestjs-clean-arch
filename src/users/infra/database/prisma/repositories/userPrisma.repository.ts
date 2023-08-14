import { Either, left, right } from '@/shared/domain/contracts/either'
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import {
    EmailExistsReturn,
    FindByEmailReturn,
    UserRepository,
} from '@/users/domain/repositories/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'
import { ConflictError } from '@/shared/domain/errors/conflict.error'

export class UserPrismaRepository implements UserRepository.Repository {
    constructor(private readonly prismaService: PrismaService) {}

    async findByEmail(email: string): FindByEmailReturn {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return left(new NotFoundError('User not found'))
        }

        return right(UserModelMapper.toEntity(user))
    }
    async emailExists(email: string): EmailExistsReturn {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        })

        if (user) return left(new ConflictError('Email already exists'))

        return right(null)
    }
    search(
        props: UserRepository.SearchParams,
    ): Promise<UserRepository.SearchResult> {}
    async insert(entity: UserEntity): Promise<void> {
        await this.prismaService.user.create({
            data: {
                ...entity.toJSON(),
            },
        })
    }
    async findById(id: string): Promise<Either<NotFoundError, UserEntity>> {
        try {
            const user = await this._get(id)
            return right(user)
        } catch (e) {
            if (e instanceof NotFoundError) {
                return left(e)
            }
        }
    }
    async findAll(): Promise<UserEntity[]> {
        const users = await this.prismaService.user.findMany()

        return users.map(user => UserModelMapper.toEntity(user))
    }
    async update(entity: UserEntity): Promise<void> {
        await this._get(entity.id)
        await this.prismaService.user.update({
            where: {
                id: entity.id,
            },
            data: {
                name: entity.props.name,
            },
        })
    }
    async delete(id: string): Promise<void> {
        await this._get(id)
        await this.prismaService.user.delete({
            where: {
                id: id,
            },
        })
    }

    protected async _get(id: string): Promise<UserEntity> {
        const userInDb = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        })

        if (!userInDb) {
            throw new NotFoundError('User not found')
        }

        return UserModelMapper.toEntity(userInDb)
    }
}
