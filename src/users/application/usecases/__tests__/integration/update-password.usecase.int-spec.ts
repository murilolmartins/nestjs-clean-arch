import { DatabaseModule } from '@/shared/infra/database/database.module'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UpdatePasswordUseCase } from '../../update-password.usecase'
import { HashProvider } from '@/users/application/providers/hash.provider'
import { BcryptHashProvider } from '@/users/infra/providers/hash/bccrypt-hash.provider'

describe('UpdatePasswordUseCase integration tests', () => {
    let prismaClient: PrismaClient
    let sut: UpdatePasswordUseCase.UseCase
    let hashProvider: HashProvider
    let repository: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        prismaClient = prismaConnection()
        repository = new UserPrismaRepository(prismaClient as any)
        hashProvider = new BcryptHashProvider()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaClient)],
        }).compile()
    })

    beforeEach(async () => {
        sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
        await prismaClient.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should update an user password', async () => {
        const userProps = UserDataBuilder()

        const hashedPassword = await hashProvider.generateHash(
            userProps.password,
        )

        const entity = new UserEntity({
            ...userProps,
            password: hashedPassword,
        })

        await prismaClient.user.create({
            data: entity.toJSON(),
        })

        let user = await prismaClient.user.findUnique({
            where: { id: entity.id },
        })

        expect(user).toStrictEqual(entity.toJSON())

        const result = await sut.execute({
            id: entity.id,
            newPassword: '12345678',
            currentPassword: userProps.password,
        })

        user = await prismaClient.user.findUnique({
            where: { id: entity.id },
        })

        const isPasswordsEqual = hashProvider.compareHash(
            '12345678',
            user.password,
        )

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toBeDefined()
        expect(result.isRight() && result.value.message).toEqual(
            'Password updated successfully',
        )
        expect(isPasswordsEqual).toBeTruthy()
    })
})
