import { DatabaseModule } from '@/shared/infra/database/database.module'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { GetUserUseCase } from '../../get-user.usecase'

describe('GetUserUseCase integration tests', () => {
    let prismaClient: PrismaClient
    let sut: GetUserUseCase.UseCase
    let repository: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        prismaClient = prismaConnection()
        repository = new UserPrismaRepository(prismaClient as any)
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaClient)],
        }).compile()
    })

    beforeEach(async () => {
        sut = new GetUserUseCase.UseCase(repository)
        await prismaClient.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should get an user', async () => {
        const userProps = UserDataBuilder()

        const entity = new UserEntity(userProps)

        await prismaClient.user.create({
            data: entity.toJSON(),
        })

        const result = await sut.execute({ id: entity.id })

        const users = await prismaClient.user.findMany()

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toBeDefined()
        expect(result.isRight() && result.value.id).toBeDefined()
        expect(result.isRight() && result.value.name).toEqual(userProps.name)
        expect(result.isRight() && result.value.email).toEqual(userProps.email)
        expect(result.isRight() && result.value.createdAt).toBeInstanceOf(Date)
        expect(result.isRight() && result.value.updatedAt).toBeInstanceOf(Date)
        expect(users.length).toBe(1)
        expect(result.isRight() && result.value.id).toEqual(entity.id)
        expect(result.isRight() && result.value.id).toEqual(users[0].id)
    })
})
