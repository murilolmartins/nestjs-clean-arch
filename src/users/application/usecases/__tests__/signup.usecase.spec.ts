import { BcryptHashProvider } from '@/users/infra/providers/hash/bccrypt-hash.provider'
import { SignupUseCase } from '../signup.usecase'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { faker } from '@faker-js/faker'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { EntityValidationError } from '@/shared/domain/errors/validation.error'
import { ConflictError } from '@/shared/domain/errors/conflict.error'
import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/userInMemory.repository'

describe('Signup usecase unit tests', () => {
    let sut: SignupUseCase.UseCase
    let repository: UserInMemoryRepository
    let hashProvider: BcryptHashProvider

    beforeAll(() => {
        hashProvider = new BcryptHashProvider()
        repository = new UserInMemoryRepository()
        sut = new SignupUseCase.UseCase(repository, hashProvider)
    })

    it('Should return a user if data is valid', async () => {
        const spyInsert = jest.spyOn(repository, 'insert')
        const spyEmailExists = jest.spyOn(repository, 'emailExists')
        const spyGenerateHash = jest.spyOn(hashProvider, 'generateHash')

        const user = UserDataBuilder()

        const result = await sut.execute(user)

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toBeDefined()
        expect(result.isRight() && result.value.id).toBeDefined()
        expect(result.isRight() && result.value.name).toEqual(user.name)
        expect(result.isRight() && result.value.email).toEqual(user.email)
        expect(result.isRight() && result.value.createdAt).toBeInstanceOf(Date)
        expect(result.isRight() && result.value.updatedAt).toBeInstanceOf(Date)
        expect(spyInsert).toBeCalledTimes(1)
        expect(spyEmailExists).toBeCalledTimes(1)
        expect(spyGenerateHash).toBeCalledTimes(1)
    })

    it('Should return a BadRequestError if is missing a input field', async () => {
        const user = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
        }

        const result = await sut.execute(user as any)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(BadRequestError)
        expect(result.value).toHaveProperty('message', 'Missing fields')
    })

    it('Should return a EntityValidation error if email is wrong', async () => {
        const user = UserDataBuilder()
        user.email = 'wrong_email'

        const result = await sut.execute(user)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(EntityValidationError)
        expect(result.value).toHaveProperty(
            'message',
            'Entity validation error',
        )
    })

    it('should not be able to register with same email twice', async () => {
        const props = UserDataBuilder({ email: 'a@a.com' })
        await sut.execute(props)

        const userOrError = await sut.execute(props)

        expect(userOrError.isLeft()).toBeTruthy()
        expect(userOrError.value).toBeInstanceOf(ConflictError)
        expect(userOrError.value).toHaveProperty(
            'message',
            'Email already exists',
        )
    })
})
