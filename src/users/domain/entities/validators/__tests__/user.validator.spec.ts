import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserValidator, UserValidatorFactory } from '../user.validator'

describe('UserValidator unit tests', () => {
    let sut: UserValidator
    beforeEach(() => {
        sut = UserValidatorFactory.create()
    })
    it('Should return true if data is valid', () => {
        const data = UserDataBuilder()
        const isValid = sut.validate(data)
        expect(isValid).toBe(true)
    })
    it('Should return false if data is invalid', () => {
        const data = {
            name: 'any_name',
            email: 'any_email',
            password: 'pass',
        }
        const isValid = sut.validate(data)
        expect(isValid).toBe(false)
        expect(sut.errors).toStrictEqual({
            email: ['email must be an email'],
            password: ['password must be longer than or equal to 8 characters'],
        })
    })
    it('Should return false if data is null', () => {
        const data = null
        const isValid = sut.validate(data)
        expect(isValid).toBe(false)
        expect(sut.errors).toStrictEqual({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ],
            email: [
                'email should not be empty',
                'email must be a string',
                'email must be an email',
            ],
            password: [
                'password should not be empty',
                'password must be longer than or equal to 8 characters',
            ],
        })
    })
    it('Should return false if data is undefined', () => {
        const data = undefined
        const isValid = sut.validate(data)
        expect(isValid).toBe(false)
        expect(sut.errors).toStrictEqual({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ],
            email: [
                'email should not be empty',
                'email must be a string',
                'email must be an email',
            ],
            password: [
                'password should not be empty',
                'password must be longer than or equal to 8 characters',
            ],
        })
    })
})
