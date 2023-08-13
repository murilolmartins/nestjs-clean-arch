import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { left, right } from '@/shared/domain/contracts/either'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { SignUpController } from '../../signup.controller'

describe('SignUpController unit tests', () => {
    let sut: SignUpController.Controller
    let useCase: jest.Mocked<SignupUseCase.UseCase>

    beforeEach(() => {
        useCase = {
            execute: jest.fn(),
        } as any
        sut = new SignUpController.Controller(useCase)
    })
    it('should create an user', async () => {
        const userProps = UserDataBuilder()

        const request = {
            body: userProps,
        }

        const response = {
            id: 'any_id',
            name: userProps.name,
            email: userProps.email,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        useCase.execute.mockResolvedValueOnce(Promise.resolve(right(response)))

        const result = await sut.handle(request)

        expect(result.statusCode).toBe(201)
        expect(result.body).toStrictEqual(response)
    })

    it('should return an error if useCase returns BadRequestError', async () => {
        const userProps = UserDataBuilder()

        const request = {
            body: userProps,
        }

        const response = new BadRequestError('Missing fields')

        useCase.execute.mockResolvedValueOnce(Promise.resolve(left(response)))

        const result = await sut.handle(request)

        expect(result.statusCode).toBe(400)
        expect(result.body).toStrictEqual({
            message: response.message,
            error: response.name,
        })
    })
})
