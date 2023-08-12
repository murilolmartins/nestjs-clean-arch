import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserUseCase } from '../update-user.usecase'
import { UserInMemoryRepository } from '@/users/infra/repositories/userInMemory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { UserNotFoundError } from '../../errors/user-not-found.error'

describe('UpdateUserUseCase unit tests', () => {
    let sut: UpdateUserUseCase.UseCase
    let repository: UserInMemoryRepository
    let spyUpdate: jest.SpyInstance

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new UpdateUserUseCase.UseCase(repository)
        spyUpdate = jest.spyOn(repository, 'update')
    })
    it('Should update a user', async () => {
        const userProps = UserDataBuilder()

        const user = new UserEntity(userProps)

        repository.entities.push(user)

        const result = await sut.execute({ id: user.id, name: 'new name' })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual({
            id: user.id,
            name: 'new name',
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        expect(spyUpdate).toBeCalledTimes(1)
    })

    it('should not call update if name field does not exist in input', async () => {
        const userProps = UserDataBuilder()

        const user = new UserEntity(userProps)

        repository.entities.push(user)

        const result = await sut.execute({ id: user.id })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        expect(spyUpdate).toBeCalledTimes(0)
    })

    it('Should update a user', async () => {
        const userProps = UserDataBuilder()

        const user = new UserEntity(userProps)

        repository.entities.push(user)

        const result = await sut.execute({ id: user.id, name: 'new name' })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual({
            id: user.id,
            name: 'new name',
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        expect(spyUpdate).toBeCalledTimes(1)
    })

    it('Should return a BadRequestError if is missing a input field', async () => {
        const result = await sut.execute({} as any)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(BadRequestError)
        expect(result.value).toHaveProperty('message', 'Missing input fields')
        expect(spyUpdate).toBeCalledTimes(0)
    })

    it("Should return a NotFoundError if user doesn't exist", async () => {
        const result = await sut.execute({ id: 'wrong_id', name: 'new name' })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UserNotFoundError)
        expect(result.value).toHaveProperty(
            'message',
            'User not found with id: wrong_id',
        )
        expect(spyUpdate).toBeCalledTimes(0)
    })
})
