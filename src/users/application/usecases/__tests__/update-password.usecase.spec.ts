import { UserInMemoryRepository } from '@/users/infra/repositories/userInMemory.repository'
import { UpdatePasswordUseCase } from '../update-password'
import { BcryptHashProvider } from '@/users/infra/providers/hash/bccrypt-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password.error'
import { UserNotFoundError } from '../../errors/user-not-found.error'

describe('UpdatePasswordUseCase unit tests', () => {
    let sut: UpdatePasswordUseCase.UseCase
    let repository: UserInMemoryRepository
    let hashProvider: BcryptHashProvider
    let spyFindById: jest.SpyInstance
    let spyUpdate: jest.SpyInstance
    let spyCompareHash: jest.SpyInstance
    let spyGenerateHash: jest.SpyInstance

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        hashProvider = new BcryptHashProvider()
        sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
        spyFindById = jest.spyOn(repository, 'findById')
        spyUpdate = jest.spyOn(repository, 'update')
        spyCompareHash = jest.spyOn(hashProvider, 'compareHash')
        spyGenerateHash = jest.spyOn(hashProvider, 'generateHash')
    })
    it('Should update a user password', async () => {
        const userProps = UserDataBuilder()

        const hashedPassword = await hashProvider.generateHash(
            userProps.password,
        )

        const user = new UserEntity({ ...userProps, password: hashedPassword })

        repository.entities.push(user)

        const result = await sut.execute({
            id: user.id,
            currentPassword: userProps.password,
            newPassword: 'new_password',
        })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual({
            message: 'Password updated successfully',
        })
        expect(spyFindById).toBeCalledTimes(1)
        expect(spyCompareHash).toBeCalledTimes(1)
        expect(spyGenerateHash).toBeCalledTimes(2)
        expect(spyUpdate).toBeCalledTimes(1)
    })

    it('Should return a BadRequestError if is missing a input field', async () => {
        const userProps = UserDataBuilder()

        const user = new UserEntity(userProps)

        repository.entities.push(user)

        const result = await sut.execute({
            id: user.id,
            currentPassword: userProps.password,
        } as any)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(BadRequestError)
        expect(result.value).toHaveProperty('message', 'Missing input fields')
        expect(spyFindById).toBeCalledTimes(0)
        expect(spyCompareHash).toBeCalledTimes(0)
        expect(spyGenerateHash).toBeCalledTimes(0)
        expect(spyUpdate).toBeCalledTimes(0)
    })

    it('Should return a InvalidPassword if currentPassword is wrong', async () => {
        const userProps = UserDataBuilder()

        const hashedPassword = await hashProvider.generateHash(
            userProps.password,
        )

        const user = new UserEntity({ ...userProps, password: hashedPassword })

        repository.entities.push(user)

        const result = await sut.execute({
            id: user.id,
            currentPassword: 'wrong_password',
            newPassword: 'new_password',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(InvalidPasswordError)
        expect(result.value).toHaveProperty('message', 'Invalid password')
        expect(spyFindById).toBeCalledTimes(1)
        expect(spyCompareHash).toBeCalledTimes(1)
        expect(spyGenerateHash).toBeCalledTimes(1)
        expect(spyUpdate).toBeCalledTimes(0)
    })

    it('Should return a UserNotFoundError if user id does not exist', async () => {
        const result = await sut.execute({
            id: '1',
            currentPassword: 'password',
            newPassword: 'new_password',
        })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UserNotFoundError)
        expect(result.value).toHaveProperty(
            'message',
            `User not found with id: 1`,
        )
        expect(spyFindById).toBeCalledTimes(1)
        expect(spyCompareHash).toBeCalledTimes(0)
        expect(spyGenerateHash).toBeCalledTimes(0)
        expect(spyUpdate).toBeCalledTimes(0)
    })
})
