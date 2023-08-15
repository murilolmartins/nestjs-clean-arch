import { DatabaseModule } from '@/shared/infra/database/database.module'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository'
import {
    UserDataBuilder,
    UsersDataBuilder,
} from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { ListUsersUseCase } from '../../list-users.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { SortDirectionEnum } from '@/shared/domain/repositories/searchble-repository-contracts'

describe('ListUsersUseCase integration tests', () => {
    let prismaClient: PrismaClient
    let sut: ListUsersUseCase.UseCase
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
        sut = new ListUsersUseCase.UseCase(repository)
        await prismaClient.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should list users ordering by created at', async () => {
        const createdAt = new Date().getTime()
        const users = UsersDataBuilder([], 3).map(
            (userProps, index) =>
                new UserEntity({
                    ...userProps,
                    createdAt: new Date(createdAt + index * 10),
                }),
        )

        await prismaClient.user.createMany({
            data: users.map(user => user.toJSON()),
        })

        const searchParams = new UserRepository.SearchParams()

        const result = await sut.execute(searchParams)

        expect(result.isRight()).toBeTruthy()
        expect(result.isRight() && result.value.items).toHaveLength(3)
        expect(result.isRight() && result.value.items).toStrictEqual([
            users[2].toJSON(),
            users[1].toJSON(),
            users[0].toJSON(),
        ])
    })

    it('should search using filter, sort and paginate', async () => {
        const createdAt = new Date()
        const entities: UserEntity[] = []
        const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
        arrange.forEach((element, index) => {
            entities.push(
                new UserEntity({
                    ...UserDataBuilder({ name: element }),
                    createdAt: new Date(createdAt.getTime() + index),
                }),
            )
        })

        await prismaClient.user.createMany({
            data: entities.map(item => item.toJSON()),
        })

        const searchOutputPage1 = await sut.execute(
            new UserRepository.SearchParams({
                page: 1,
                perPage: 2,
                sort: 'name',
                sortDir: SortDirectionEnum.ASC,
                filter: 'TEST',
            }),
        )

        expect(searchOutputPage1.isRight()).toBeTruthy()
        expect(
            searchOutputPage1.isRight() && searchOutputPage1.value.items[0],
        ).toMatchObject(entities[0].toJSON())
        expect(
            searchOutputPage1.isRight() && searchOutputPage1.value.items[1],
        ).toMatchObject(entities[4].toJSON())

        const searchOutputPage2 = await sut.execute(
            new UserRepository.SearchParams({
                page: 2,
                perPage: 2,
                sort: 'name',
                sortDir: SortDirectionEnum.ASC,
                filter: 'TEST',
            }),
        )

        expect(
            searchOutputPage2.isRight() && searchOutputPage2.value.items[0],
        ).toMatchObject(entities[2].toJSON())
    })
})
