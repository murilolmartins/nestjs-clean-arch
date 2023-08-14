import { SignInUseCase } from '../signin.usecase'
import { BcryptHashProvider } from '@/users/infra/providers/hash/bccrypt-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/userInMemory.repository'

describe('SignInUseCase unit tests', () => {
    let sut: SignInUseCase.UseCase
    let repository: UserInMemoryRepository
    let hashProvider: BcryptHashProvider
    let spyFindByEmail: jest.SpyInstance
    let spyCompareHash: jest.SpyInstance

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        hashProvider = new BcryptHashProvider()
        sut = new SignInUseCase.UseCase(repository, hashProvider)
        spyFindByEmail = jest.spyOn(repository, 'findByEmail')
        spyCompareHash = jest.spyOn(hashProvider, 'compareHash')
    })

    it('Should return a user if email and password are valid', async () => {
        const userProps = UserDataBuilder()

        const passwordHashed = await hashProvider.generateHash(
            userProps.password,
        )

        const user = new UserEntity({ ...userProps, password: passwordHashed })

        repository.entities.push(user)

        const result = await sut.execute({
            email: user.email,
            password: userProps.password,
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        expect(spyFindByEmail).toBeCalledTimes(1)
        expect(spyCompareHash).toBeCalledTimes(1)
    })

    it('Should return a BadRequestError if is missing a input field', async () => {
        const result = await sut.execute({} as any)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toHaveProperty('message', 'Missing input fields')
        expect(spyFindByEmail).toBeCalledTimes(0)
        expect(spyCompareHash).toBeCalledTimes(0)
    })

    it('Should return a InvalidCredentialsError if email is wrong', async () => {
        const userProps = UserDataBuilder()

        const passwordHashed = await hashProvider.generateHash(
            userProps.password,
        )

        const user = new UserEntity({ ...userProps, password: passwordHashed })

        repository.entities.push(user)

        const result = await sut.execute({
            email: 'wrong_email',
            password: userProps.password,
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toHaveProperty('message', 'Invalid credentials')
        expect(spyFindByEmail).toBeCalledTimes(1)
        expect(spyCompareHash).toBeCalledTimes(0)
    })

    it('Should return a InvalidCredentialsError if password is wrong', async () => {
        const userProps = UserDataBuilder()

        const passwordHashed = await hashProvider.generateHash(
            userProps.password,
        )

        const user = new UserEntity({ ...userProps, password: passwordHashed })

        repository.entities.push(user)

        const result = await sut.execute({
            email: user.email,
            password: 'wrong_password',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toHaveProperty('message', 'Invalid credentials')
        expect(spyFindByEmail).toBeCalledTimes(1)
        expect(spyCompareHash).toBeCalledTimes(1)
    })
})
