import { SignInUseCase } from '@/users/application/usecases/signin.usecase'
import { SignInController } from '../../signin.controller'
import { left, right } from '@/shared/domain/contracts/either'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { formatDateToPtBr } from '@/shared/helpers/format-date-to-pt-br'

describe('SingInController unit tests', () => {
    let sut: SignInController.Controller
    let useCase: jest.Mocked<SignInUseCase.UseCase>

    beforeEach(() => {
        useCase = {
            execute: jest.fn(),
        } as any
        sut = new SignInController.Controller(useCase)
    })
    it('should create an user', async () => {
        const request = {
            body: {
                email: 'any_email',
                password: 'any_password',
            },
        }

        const response = {
            id: 'any_id',
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        useCase.execute.mockResolvedValueOnce(Promise.resolve(right(response)))

        const result = await sut.handle(request)

        expect(result.statusCode).toBe(200)
        expect(result.body).toStrictEqual({
            id: response.id,
            name: response.name,
            email: response.email,
            createdAt: formatDateToPtBr(response.createdAt),
            updatedAt: formatDateToPtBr(response.updatedAt),
        })
    })

    it('should return an error if useCase returns BadRequestError', async () => {
        const request = {
            body: {
                email: 'any_email',
                password: 'any_password',
            },
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
