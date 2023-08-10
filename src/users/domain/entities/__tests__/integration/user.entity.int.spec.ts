import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { EntityValidationError } from '@/shared/domain/errors/validation.error'
import { Either } from '@/shared/domain/contracts/either'
import { faker } from '@faker-js/faker'

describe('User entity integration tests', () => {
    let sut: Either<EntityValidationError, UserEntity>
    let props: UserProps

    beforeEach(() => {
        props = UserDataBuilder()
        sut = UserEntity.create(props)
    })

    describe('Create method', () => {
        test('Create method with valid fields', async () => {
            expect(sut.isRight()).toBeTruthy()
            expect(sut.value).toBeInstanceOf(UserEntity)
            expect(sut.isRight() && sut.value.email).toEqual(props.email)
            expect(sut.isRight() && sut.value.name).toEqual(props.name)
            expect(sut.isRight() && sut.value.password).toEqual(props.password)
            expect(sut.isRight() && sut.value.id).toBeDefined()
            expect(sut.isRight() && sut.value.createdAt).toBeInstanceOf(Date)
            expect(sut.isRight() && sut.value.updatedAt).toBeInstanceOf(Date)
        })

        test('Create method with invalid fields', async () => {
            props = null

            sut = UserEntity.create(props)

            expect(sut.isLeft()).toBeTruthy()
            expect(sut.value).toBeInstanceOf(EntityValidationError)
            expect(sut.isLeft() && sut.value.errors).toStrictEqual({
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

    describe('Update name method', () => {
        test('Update name method with valid name', async () => {
            expect(sut.isRight()).toBeTruthy()

            const newName = faker.person.fullName()

            sut.isRight() && sut.value.updateName(newName)

            expect(sut.isRight() && sut.value.name).toEqual(newName)
        })

        test('Update name method with invalid name', async () => {
            expect(sut.isRight()).toBeTruthy()

            const validation = sut.isRight() && sut.value.updateName('')

            expect(validation.isLeft()).toBeTruthy()
            expect(
                validation.isLeft() && validation.value.errors,
            ).toStrictEqual({
                name: ['name should not be empty'],
            })
        })
    })

    describe('Update password method', () => {
        test('Update password method with valid password', async () => {
            expect(sut.isRight()).toBeTruthy()

            const newPassword = faker.internet.password()

            const validation =
                sut.isRight() && sut.value.updatePassword(newPassword)

            expect(validation.isRight()).toBeTruthy()
            expect(validation.isRight() && validation.value).toEqual(
                newPassword,
            )
            expect(sut.isRight() && sut.value.password).toEqual(newPassword)
        })

        test('Update password method with invalid password', async () => {
            expect(sut.isRight()).toBeTruthy()

            const validation = sut.isRight() && sut.value.updatePassword('')

            expect(validation.isLeft()).toBeTruthy()
            expect(
                validation.isLeft() && validation.value.errors,
            ).toStrictEqual({
                password: [
                    'password should not be empty',
                    'password must be longer than or equal to 8 characters',
                ],
            })
        })
    })
})
