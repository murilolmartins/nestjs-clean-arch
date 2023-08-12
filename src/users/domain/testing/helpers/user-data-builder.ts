import { UserProps } from '../../entities/user.entity'
import { faker } from '@faker-js/faker'

export const UserDataBuilder = (data?: Partial<UserProps>): UserProps => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...data,
})

export const UsersDataBuilder = (
    data = [] as Partial<UserProps>[],
    quantity = 5,
): UserProps[] =>
    data.length
        ? data.map(user => UserDataBuilder(user))
        : Array.from({ length: quantity }, () => UserDataBuilder())
