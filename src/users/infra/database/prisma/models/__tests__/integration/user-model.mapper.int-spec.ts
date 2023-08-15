import { UserModelMapper } from '../../user-model.mapper'
import { PrismaClient, User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'

describe('UserModelMapper integration tests', () => {
    let prismaClient: PrismaClient
    let user: User

    beforeAll(async () => {
        prismaClient = prismaConnection()
        prismaClient.$connect()
    })

    beforeEach(async () => {
        await prismaClient.user.deleteMany()
        user = await prismaClient.user.create({
            data: {
                id: randomUUID(),
                name: 'any_name',
                email: 'any_email',
                password: 'any_password',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })
    })

    afterAll(async () => {
        await prismaClient.$disconnect()
    })

    test('should return a UserEntity', () => {
        const sut = UserModelMapper.toEntity(user)

        expect(sut).toBeInstanceOf(UserEntity)
        expect(sut).toHaveProperty('id')
        expect(sut).toHaveProperty('name', user.name)
        expect(sut).toHaveProperty('email', user.email)
        expect(sut).toHaveProperty('password', user.password)
        expect(sut).toHaveProperty('createdAt', user.createdAt)
        expect(sut).toHaveProperty('updatedAt', user.updatedAt)
    })
})
