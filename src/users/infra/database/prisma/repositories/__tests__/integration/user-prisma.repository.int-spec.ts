import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { DatabaseModule } from '@/shared/infra/database/database.module'
import {
    UserDataBuilder,
    UsersDataBuilder,
} from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import { SortDirectionEnum } from '@/shared/domain/repositories/searchble-repository-contracts'
import { UserRepository } from '@/users/domain/repositories/user.repository'

describe('UserPrismaRepository integration tests', () => {
    let prismaClient: PrismaClient
    let sut: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        prismaClient = prismaConnection()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaClient)],
        }).compile()
    })

    beforeEach(async () => {
        sut = new UserPrismaRepository(prismaClient as any)
        await prismaClient.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    describe('FindByID method', () => {
        it('should return an user when find by id and id exists in entities', async () => {
            const userProps = UserDataBuilder()

            const entity = new UserEntity(userProps)

            const user = await prismaClient.user.create({
                data: entity.toJSON(),
            })

            const userFound = await sut.findById(user.id)

            expect(userFound.isRight()).toBeTruthy()
            expect(userFound.value).toHaveProperty('id', user.id)
            expect(userFound.value).toHaveProperty('name', user.name)
            expect(userFound.value).toHaveProperty('email', user.email)
            expect(userFound.value).toHaveProperty('password', user.password)
            expect(userFound.value).toHaveProperty('createdAt', user.createdAt)
            expect(userFound.value).toHaveProperty('updatedAt', user.updatedAt)
        })

        it('should return error finding by id and id not exists in entities', async () => {
            const userFound = await sut.findById(randomUUID())

            expect(userFound.isLeft()).toBeTruthy()
            expect(userFound.value).toHaveProperty('message', 'User not found')
        })
    })

    describe('FindByEmail method', () => {
        it('should return an user when find by email and email exists in entities', async () => {
            const userProps = UserDataBuilder()

            const entity = new UserEntity(userProps)

            const user = await prismaClient.user.create({
                data: entity.toJSON(),
            })

            const userFound = await sut.findByEmail(user.email)

            expect(userFound.isRight()).toBeTruthy()
            expect(
                userFound.isRight() && userFound.value.toJSON(),
            ).toStrictEqual(user)
        })

        it('should return error finding by email and email not exists in entities', async () => {
            const userFound = await sut.findByEmail(faker.internet.email())

            expect(userFound.isLeft()).toBeTruthy()
            expect(userFound.value).toHaveProperty('message', 'User not found')
        })
    })

    describe('Insert method', () => {
        it('should insert an user', async () => {
            const userProps = UserDataBuilder()

            const entity = new UserEntity(userProps)

            await sut.insert(entity)

            const users = await prismaClient.user.findMany()

            expect(users.length).toBe(1)
            expect(users[0]).toHaveProperty('id', entity.id)
        })
    })

    describe('EmailExists method', () => {
        it('should return null when email not exists in entities', async () => {
            const emailExists = await sut.emailExists(faker.internet.email())

            expect(emailExists.isRight()).toBeTruthy()
            expect(emailExists.value).toBeNull()
        })

        it('should return ConflictError when email exists in entities', async () => {
            const userProps = UserDataBuilder()

            const entity = new UserEntity(userProps)

            await prismaClient.user.create({
                data: entity.toJSON(),
            })

            const emailExists = await sut.emailExists(entity.email)

            expect(emailExists.isLeft()).toBeTruthy()
            expect(emailExists.value).toHaveProperty(
                'message',
                'Email already exists',
            )
        })
    })

    describe('FindAll method', () => {
        it('should return all users', async () => {
            const users = UsersDataBuilder().map(
                userProps => new UserEntity(userProps),
            )

            await prismaClient.user.createMany({
                data: users.map(user => user.toJSON()),
            })

            const result = await sut.findAll()

            expect(result).toHaveLength(users.length)

            result.forEach((user, index) => {
                expect(user).toMatchObject(users[index].toJSON())
            })
        })
    })

    describe('Delete method', () => {
        it('should delete an user', async () => {
            const userProps = UserDataBuilder()

            const entity = new UserEntity(userProps)

            const user = await prismaClient.user.create({
                data: entity.toJSON(),
            })

            let users = await prismaClient.user.findMany()

            expect(users).toHaveLength(1)

            await sut.delete(user.id)

            users = await prismaClient.user.findMany()

            expect(users).toHaveLength(0)
        })
    })

    describe('Update method', () => {
        it('should update an user', async () => {
            const userProps = UserDataBuilder()

            const entity = new UserEntity(userProps)

            const user = await prismaClient.user.create({
                data: entity.toJSON(),
            })

            const newName = faker.person.fullName()

            entity.updateName(newName)

            await sut.update(entity)

            const users = await prismaClient.user.findMany()

            expect(users).toHaveLength(1)
            expect(users[0]).toHaveProperty('name', newName)
            expect(users[0]).toHaveProperty('id', user.id)
        })
    })

    describe('Search method', () => {
        it('should return a SearchResult with users', async () => {
            const createdAt = new Date().getTime()
            const users = UsersDataBuilder([], 16).map(
                (userProps, index) =>
                    new UserEntity({
                        ...userProps,
                        createdAt: new Date(createdAt - index * 10),
                    }),
            )

            await prismaClient.user.createMany({
                data: users.map(user => user.toJSON()),
            })

            const searchParams = new UserRepository.SearchParams()

            const result = await sut.search(searchParams)

            expect(result).toBeInstanceOf(UserRepository.SearchResult)
            expect(result).toHaveProperty('items')
            expect(result.items.length).toBe(15)
            expect(result).toHaveProperty('total', users.length)
            expect(result).toHaveProperty('currentPage', 1)
            expect(result).toHaveProperty('perPage', 15)
            expect(result).toHaveProperty('sortDir', SortDirectionEnum.DESC)
            expect(result).toHaveProperty('filter', null)
            expect(result).toHaveProperty('sort', 'createdAt')
            expect(result).toHaveProperty('lastPage', 2)

            result.items.forEach((user, index) => {
                expect(user.toJSON()).toMatchObject(users[index].toJSON())
                expect(user).toBeInstanceOf(UserEntity)
                index < result.items.length - 1 &&
                    expect(user.createdAt.getTime()).toBeGreaterThan(
                        result.items[index + 1].createdAt.getTime(),
                    )
            })
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

            const searchOutputPage1 = await sut.search(
                new UserRepository.SearchParams({
                    page: 1,
                    perPage: 2,
                    sort: 'name',
                    sortDir: SortDirectionEnum.ASC,
                    filter: 'TEST',
                }),
            )

            expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
                entities[0].toJSON(),
            )
            expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
                entities[4].toJSON(),
            )

            const searchOutputPage2 = await sut.search(
                new UserRepository.SearchParams({
                    page: 2,
                    perPage: 2,
                    sort: 'name',
                    sortDir: SortDirectionEnum.ASC,
                    filter: 'TEST',
                }),
            )

            expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
                entities[2].toJSON(),
            )
        })
    })
})
