import { UserInMemoryRepository } from '@/users/infra/repositories/userInMemory.repository'
import { DeleteUserUsecase } from '../delete-user.usecase'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { UserNotFoundError } from '../../errors/user-not-found.error'

describe('DeleteUserUseCase unit tests', () => {
    let sut: DeleteUserUsecase.UseCase
    let repository: UserInMemoryRepository
    let spyFindById: jest.SpyInstance
    let spyDelete: jest.SpyInstance

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new DeleteUserUsecase.UseCase(repository)
        spyDelete = jest.spyOn(repository, 'delete')
        spyFindById = jest.spyOn(repository, 'findById')
    })

    it('Should delete a user', async () => {
        const userProps = UserDataBuilder()

        const user = new UserEntity(userProps)

        repository.entities.push(user)

        const result = await sut.execute({ id: user.id })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual({
            message: 'User deleted successfully',
        })
        expect(repository.entities).toHaveLength(0)
        expect(spyFindById).toBeCalledTimes(1)
        expect(spyDelete).toBeCalledTimes(1)
    })

    it('Should return a BadRequestError if is missing a input field', async () => {
        const result = await sut.execute({} as any)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(BadRequestError)
        expect(result.value).toHaveProperty('message', 'Missing input fields')
        expect(spyFindById).toBeCalledTimes(0)
        expect(spyDelete).toBeCalledTimes(0)
    })

    it('Should return a UserNotFoundError if id does not exist', async () => {
        const result = await sut.execute({ id: 'wrong_id' })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(UserNotFoundError)
        expect(result.value).toHaveProperty(
            'message',
            'User not found with id: wrong_id',
        )
        expect(spyFindById).toBeCalledTimes(1)
        expect(spyDelete).toBeCalledTimes(0)
    })
})
