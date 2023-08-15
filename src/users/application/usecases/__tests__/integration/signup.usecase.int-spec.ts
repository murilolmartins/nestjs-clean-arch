import { DatabaseModule } from '@/shared/infra/database/database.module'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { SignupUseCase } from '../../signup.usecase'
import { HashProvider } from '@/users/application/providers/hash.provider'
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository'
import { BcryptHashProvider } from '@/users/infra/providers/hash/bccrypt-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('SignupUsecase integration tests', () => {
    let prismaClient: PrismaClient
    let sut: SignupUseCase.UseCase
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
        sut = new SignupUseCase.UseCase(repository, hashProvider)
        await prismaClient.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should create an user', async () => {
        const userProps = UserDataBuilder()

        const result = await sut.execute(userProps)

        const users = await prismaClient.user.findMany()

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toBeDefined()
        expect(result.isRight() && result.value.id).toBeDefined()
        expect(result.isRight() && result.value.name).toEqual(userProps.name)
        expect(result.isRight() && result.value.email).toEqual(userProps.email)
        expect(result.isRight() && result.value.createdAt).toBeInstanceOf(Date)
        expect(result.isRight() && result.value.updatedAt).toBeInstanceOf(Date)
        expect(users.length).toBe(1)
        expect(result.isRight() && result.value.id).toEqual(users[0].id)
    })
})
