import { UserInMemoryRepository } from '@/users/infra/repositories/userInMemory.repository'
import { GetUserUseCase } from '../get-user.usecase'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'

describe('GetUserUseCase unit tests', () => {
    let sut: GetUserUseCase.UseCase
    let userRepository: UserInMemoryRepository

    beforeEach(() => {
        userRepository = new UserInMemoryRepository()
        sut = new GetUserUseCase.UseCase(userRepository)
    })

    it('Should return a user', async () => {
        const user = new UserEntity(UserDataBuilder())

        await userRepository.insert(user)

        const spyFindById = jest.spyOn(userRepository, 'findById')
        const result = await sut.execute({ id: user.id })

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
        expect(spyFindById).toBeCalledTimes(1)
    })

    it('Should return a BadRequestError if is missing a input field', async () => {
        const result = await sut.execute({} as any)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(BadRequestError)
        expect(result.value).toHaveProperty('message', 'Missing input fields')
    })

    it("Should return a NotFoundError if user doesn't exist", async () => {
        const spyFindById = jest.spyOn(userRepository, 'findById')
        const result = await sut.execute({ id: 'wrong_id' })

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
        expect(result.value).toHaveProperty('message', 'Entity not found')
        expect(spyFindById).toBeCalledTimes(1)
    })
})
