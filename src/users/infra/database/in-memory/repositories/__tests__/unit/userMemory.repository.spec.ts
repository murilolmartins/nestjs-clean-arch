import { UserEntity } from '@/users/domain/entities/user.entity'
import { UsersDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'
import { ConflictError } from '@/shared/domain/errors/conflict.error'
import { SortDirectionEnum } from '@/shared/domain/repositories/searchble-repository-contracts'
import { UserInMemoryRepository } from '../../userInMemory.repository'

describe('UserMemoryRepository unit tests', () => {
    let sut: UserInMemoryRepository

    beforeEach(() => {
        sut = new UserInMemoryRepository()
    })

    describe('FindByEmail method', () => {
        let users: UserEntity[]

        beforeEach(() => {
            users = UsersDataBuilder().map(
                userProps => new UserEntity(userProps),
            )
            users.forEach(user => {
                sut.entities.push(user)
            })
        })

        it('should return an user when find by email and email exists in entities', async () => {
            const user = await sut.findByEmail(users[0].email)

            expect(user.isRight()).toBeTruthy()
            expect(user.value).toStrictEqual(users[0])
        })

        it('should return error finding by email and email not exists in entities', async () => {
            const user = await sut.findByEmail('mail@mail.com')

            expect(user.isLeft()).toBeTruthy()
            expect(user.value).toStrictEqual(
                new NotFoundError('User not found'),
            )
        })
    })

    describe('EmailExists method', () => {
        let users: UserEntity[]

        beforeEach(() => {
            users = UsersDataBuilder().map(
                userProps => new UserEntity(userProps),
            )
            users.forEach(user => {
                sut.entities.push(user)
            })
        })

        it('should return null when email not exists in entities', async () => {
            const emailExists = await sut.emailExists('mail@mail.com')

            expect(emailExists.isRight()).toBeTruthy()
            expect(emailExists.value).toBeNull()
        })

        it('should return ConflictError when email exists in entities', async () => {
            const emailExists = await sut.emailExists(users[0].email)

            expect(emailExists.isLeft()).toBeTruthy()
            expect(emailExists.value).toStrictEqual(
                new ConflictError('Email already exists'),
            )
        })
    })

    describe('ApplyFilter method', () => {
        let users: UserEntity[]

        beforeEach(() => {
            users = UsersDataBuilder().map(
                userProps => new UserEntity(userProps),
            )
            users.forEach(user => {
                sut.entities.push(user)
            })
        })

        it('should return all users when filter is null', async () => {
            const spyFilter = jest.spyOn(users, 'filter')
            const filteredUsers = await sut['applyFilter'](users, null)

            expect(filteredUsers).toStrictEqual(users)
            expect(spyFilter).not.toHaveBeenCalled()
        })

        it('should return filtered users when filter is not null', async () => {
            const spyFilter = jest.spyOn(users, 'filter')
            const filteredUsers = await sut['applyFilter'](users, users[0].name)

            expect(spyFilter).toHaveBeenCalledTimes(1)
            expect(filteredUsers).toStrictEqual([users[0]])
        })
    })

    describe('ApplySort method', () => {
        const users: UserEntity[] = []

        beforeAll(async () => {
            const usersProps = UsersDataBuilder([
                { name: 'b' },
                { name: 'a' },
                { name: 'c' },
            ])

            usersProps.forEach(userProps => {
                users.push(new UserEntity(userProps))
            })
        })

        it('should return sorted users when sort is name and sortDir is asc', async () => {
            const sortedUsers = await sut['applySort'](
                users,
                'name',
                SortDirectionEnum.ASC,
            )

            expect(sortedUsers).toStrictEqual([users[1], users[0], users[2]])
        })

        it('should return sorted users when sort is name and sortDir is desc', async () => {
            const sortedUsers = await sut['applySort'](
                users,
                'name',
                SortDirectionEnum.DESC,
            )

            expect(sortedUsers).toStrictEqual([users[2], users[0], users[1]])
        })

        it('should return sorted users with dir desc when sort is name and sortDir is null', async () => {
            const sortedUsers = await sut['applySort'](users, 'name', null)

            expect(sortedUsers).toStrictEqual([users[2], users[0], users[1]])
        })

        it('should return sorted users by createdAt when sort is null', async () => {
            const sortedUsers = await sut['applySort'](
                users,
                null,
                SortDirectionEnum.ASC,
            )

            expect(sortedUsers).toStrictEqual([users[0], users[1], users[2]])
        })
    })
})
