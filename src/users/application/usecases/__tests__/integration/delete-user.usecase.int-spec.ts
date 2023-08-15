import { DatabaseModule } from '@/shared/infra/database/database.module'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { DeleteUserUseCase } from '../../delete-user.usecase'

describe('DeleteUserUseCase integration tests', () => {
    let prismaClient: PrismaClient
    let sut: DeleteUserUseCase.UseCase
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
        sut = new DeleteUserUseCase.UseCase(repository)
        await prismaClient.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should delete an user', async () => {
        const userProps = UserDataBuilder()

        const entity = new UserEntity(userProps)

        await prismaClient.user.create({
            data: entity.toJSON(),
        })

        const users = await prismaClient.user.findMany()

        expect(users.length).toBe(1)

        const result = await sut.execute({ id: entity.id })

        const user = await prismaClient.user.findUnique({
            where: { id: entity.id },
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.isRight() && result.value.message).toBe(
            'User deleted successfully',
        )
        expect(users.length).toBe(1)
        expect(user).toBeNull()
    })
})
