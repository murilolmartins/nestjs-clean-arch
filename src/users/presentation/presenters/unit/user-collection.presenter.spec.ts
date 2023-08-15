import { UserOutput } from '@/users/application/dto/user-output'
import {
    UserCollectionPresenter,
    UserCollectionPresenterProps,
} from '../user-collection.presenter'
import { faker } from '@faker-js/faker'
import { formatDateToPtBr } from '@/shared/helpers/format-date-to-pt-br'

describe('UserCollectionPresenter unit tests', () => {
    let sut: UserCollectionPresenter
    let users: UserOutput[]

    beforeEach(() => {
        users = Array.from({ length: 2 }, () => ({
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
        }))

        const usersPaginated: UserCollectionPresenterProps = {
            items: users,
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            total: 10,
        }
        sut = new UserCollectionPresenter(usersPaginated)
    })

    test('Class contructor', () => {
        expect(sut.data).toStrictEqual([
            {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email,
                createdAt: formatDateToPtBr(users[0].createdAt),
                updatedAt: formatDateToPtBr(users[0].updatedAt),
            },
            {
                id: users[1].id,
                name: users[1].name,
                email: users[1].email,
                createdAt: formatDateToPtBr(users[1].createdAt),
                updatedAt: formatDateToPtBr(users[1].updatedAt),
            },
        ])
        expect(sut.meta).toStrictEqual({
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            total: 10,
        })
    })

    it("should serialize the 'data' and 'meta' properties", () => {
        const serialized = sut.toPresentation()

        expect(serialized).toStrictEqual({
            data: [
                {
                    id: users[0].id,
                    name: users[0].name,
                    email: users[0].email,
                    createdAt: formatDateToPtBr(users[0].createdAt),
                    updatedAt: formatDateToPtBr(users[0].updatedAt),
                },
                {
                    id: users[1].id,
                    name: users[1].name,
                    email: users[1].email,
                    createdAt: formatDateToPtBr(users[1].createdAt),
                    updatedAt: formatDateToPtBr(users[1].updatedAt),
                },
            ],
            meta: {
                currentPage: 1,
                perPage: 2,
                lastPage: 1,
                total: 10,
            },
        })
    })
})
