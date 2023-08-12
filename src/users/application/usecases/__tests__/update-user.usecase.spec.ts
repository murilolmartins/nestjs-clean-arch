import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserUseCase } from '../update-user.usecase'
import { UserInMemoryRepository } from '@/users/infra/repositories/userInMemory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'

describe('UpdateUserUseCase unit tests', () => {
    let sut: UpdateUserUseCase.UseCase
    let repository: UserInMemoryRepository

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new UpdateUserUseCase.UseCase(repository)
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
    })

    it('Should return a BadRequestError if is missing a input field', async () => {
        const result = await sut.execute({} as any)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(BadRequestError)
        expect(result.value).toHaveProperty('message', 'Missing input fields')
    })

    it("Should return a NotFoundError if user doesn't exist", async () => {
        const result = await sut.execute({ id: 'wrong_id', name: 'new name' })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
        expect(result.value).toHaveProperty('message', 'Entity not found')
    })
})
