import { UserOutput } from '@/users/application/dto/user-output'
import { UserPresenter } from '../user.presenter'
import { formatDateToPtBr } from '@/shared/helpers/format-date-to-pt-br'

describe('UserPresenter unit test', () => {
    it('should return a serialized user', () => {
        const user: UserOutput = {
            id: '1',
            name: 'John Doe',
            email: 'jhon@email.com',
            password: '123456789',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const userToPresent = new UserPresenter(user)

        expect(userToPresent.toPresentation()).toEqual({
            id: '1',
            name: 'John Doe',
            email: user.email,
            createdAt: formatDateToPtBr(user.createdAt),
            updatedAt: formatDateToPtBr(user.updatedAt),
        })
    })
})
