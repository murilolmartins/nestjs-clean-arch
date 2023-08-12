import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../user-output'

describe('UserOutoutMapper unit tests', () => {
    it('Should return a UserOutput', () => {
        const userProps = UserDataBuilder()

        const user = new UserEntity(userProps)

        const result = UserOutputMapper.toOutput(user)

        expect(result).toStrictEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
    })
})
