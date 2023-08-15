import { DatabaseModule } from '@/shared/infra/database/database.module'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UpdateUserUseCase } from '../../update-user.usecase'
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { faker } from '@faker-js/faker'

describe('UpdateUserUseCase integration tests', () => {
    let prismaClient: PrismaClient
    let sut: UpdateUserUseCase.UseCase
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
        sut = new UpdateUserUseCase.UseCase(repository)
        await prismaClient.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should update an user', async () => {
        const userProps = UserDataBuilder()

        const entity = new UserEntity(userProps)

        await prismaClient.user.create({
            data: entity.toJSON(),
        })

        let user = await prismaClient.user.findUnique({
            where: { id: entity.id },
        })

        expect(user).toStrictEqual(entity.toJSON())

        const newName = faker.person.fullName()

        const result = await sut.execute({ id: entity.id, name: newName })

        user = await prismaClient.user.findUnique({
            where: { id: entity.id },
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toBeDefined()
        expect(result.isRight() && result.value.id).toEqual(user.id)
        expect(result.isRight() && result.value.name).toEqual(newName)
        expect(result.isRight() && result.value.email).toEqual(user.email)
        expect(result.isRight() && result.value.createdAt).toEqual(
            user.createdAt,
        )
        expect(result.isRight() && result.value.updatedAt).toEqual(
            user.updatedAt,
        )
    })
})
