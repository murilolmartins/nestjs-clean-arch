import { UsersDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ListUsersUseCase } from '../list-users.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import {
    SearchResult,
    SortDirectionEnum,
} from '@/shared/domain/repositories/searchble-repository-contracts'
import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/userInMemory.repository'

describe('ListUserUseCase unit tests', () => {
    let sut: ListUsersUseCase.UseCase
    let repository: UserInMemoryRepository

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new ListUsersUseCase.UseCase(repository)
    })

    it('Should return a list of users', async () => {
        const usersProps = UsersDataBuilder()

        const users = usersProps.map(userProps => new UserEntity(userProps))

        users.forEach(user => {
            repository.entities.push(user)
        })

        const result = await sut.execute({})

        expect(result.isRight()).toBeTruthy()
        expect(result.isRight() && result.value.items).toHaveLength(5)
        expect(result.isRight() && result.value.total).toBe(5)
        expect(result.isRight() && result.value.items[0]).toStrictEqual({
            id: users[0].id,
            name: users[0].name,
            email: users[0].email,
            createdAt: users[0].createdAt,
            updatedAt: users[0].updatedAt,
        })
    })

    it('Should return a list of users with pagination sorted by name', async () => {
        const usersProps = UsersDataBuilder([
            { name: 'd' },
            { name: 'b' },
            { name: 'a' },
        ])

        const users = usersProps.map(userProps => new UserEntity(userProps))

        repository.entities.push(...users)

        const result = await sut.execute({
            page: 1,
            perPage: 3,
            sort: 'name',
            sortDir: SortDirectionEnum.ASC,
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.isRight() && result.value.items).toHaveLength(3)
        expect(result.isRight() && result.value.total).toBe(3)
        expect(result.isRight() && result.value.lastPage).toBe(1)
        expect(result.isRight() && result.value.items[0].name).toStrictEqual(
            users[2].name,
        )
        expect(result.isRight() && result.value.items[1].name).toStrictEqual(
            users[1].name,
        )
        expect(result.isRight() && result.value.items[2].name).toStrictEqual(
            users[0].name,
        )
    })

    it('Should return a list of users with pagination fitered by name "a"', async () => {
        const usersProps = UsersDataBuilder([
            { name: 'd' },
            { name: 'b' },
            { name: 'a' },
        ])

        const users = usersProps.map(userProps => new UserEntity(userProps))

        repository.entities.push(...users)

        const result = await sut.execute({
            page: 1,
            perPage: 3,
            filter: 'a',
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.isRight() && result.value.items).toHaveLength(1)
        expect(result.isRight() && result.value.total).toBe(1)
        expect(result.isRight() && result.value.items[0].name).toStrictEqual(
            users[2].name,
        )
    })

    it('Should return a empty list if there is no users', async () => {
        const result = await sut.execute({})

        expect(result.isRight()).toBeTruthy()
        expect(result.isRight() && result.value.items).toHaveLength(0)
    })

    describe('toOutput method tests', () => {
        it('should return empty array when items is empty', () => {
            const result = new SearchResult({
                items: [],
                total: 0,
                currentPage: 1,
                perPage: 1,
                filter: null,
                sort: null,
                sortDir: null,
            })

            const output = sut['toOutput'](result)

            expect(output).toStrictEqual({
                items: [],
                total: 0,
                currentPage: 1,
                lastPage: 0,
                perPage: 1,
            })
        })

        it('should return a list of users with pagination', () => {
            const usersProps = UsersDataBuilder([], 2)

            const users = usersProps.map(userProps => new UserEntity(userProps))

            const result = new SearchResult({
                items: [users[0]],
                total: 2,
                currentPage: 1,
                perPage: 1,
                filter: null,
                sort: null,
                sortDir: null,
            })

            const output = sut['toOutput'](result)

            expect(output).toStrictEqual({
                items: [
                    {
                        id: users[0].id,
                        name: users[0].name,
                        email: users[0].email,
                        createdAt: users[0].createdAt,
                        updatedAt: users[0].updatedAt,
                    },
                ],
                total: 2,
                currentPage: 1,
                lastPage: 2,
                perPage: 1,
            })
        })
    })
})
