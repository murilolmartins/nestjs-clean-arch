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
    sortableFields: string[] = ['name', 'createdAt']
    constructor(private readonly prismaService: PrismaService) {}

    async insert(entity: UserEntity): Promise<void> {
        await this.prismaService.user.create({
            data: {
                id: entity.id,
                name: entity.props.name,
                email: entity.props.email,
                password: entity.props.password,
            },
        })
    }

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

    async search(
        props: UserRepository.SearchParams,
    ): Promise<UserRepository.SearchResult> {
        const sortable = this.sortableFields?.includes(props.sort) || false
        const orderByField = sortable ? props.sort : 'createdAt'
        const orderByDir = sortable ? props.sortDir : 'desc'

        const count = await this.prismaService.user.count({
            ...(props.filter && {
                where: {
                    name: {
                        contains: props.filter,
                        mode: 'insensitive',
                    },
                },
            }),
        })

        const models = await this.prismaService.user.findMany({
            ...(props.filter && {
                where: {
                    name: {
                        contains: props.filter,
                        mode: 'insensitive',
                    },
                },
            }),
            orderBy: {
                [orderByField]: orderByDir,
            },
            skip:
                props.page && props.page > 0
                    ? (props.page - 1) * props.perPage
                    : 1,
            take: props.perPage && props.perPage > 0 ? props.perPage : 15,
        })

        return new UserRepository.SearchResult({
            items: models.map(model => UserModelMapper.toEntity(model)),
            total: count,
            currentPage: props.page,
            perPage: props.perPage,
            sort: orderByField,
            sortDir: orderByDir,
            filter: props.filter,
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
            throw e
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
            data: entity.toJSON(),
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
