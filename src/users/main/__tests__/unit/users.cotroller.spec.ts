import { UsersController } from '../../users.controller'
import { FastifyReply } from 'fastify'
import * as nestControllerAdapter from '@/shared/infra/adapters/nest-controller.adapter'
import {
    DeleteUserController,
    ListUsersController,
    SignInController,
    SignUpController,
    UpdateUserController,
} from '@/users/presentation/controllers'
import { SignupDto } from '../../dto/signup.dto'
import { UpdateUserDto } from '../../dto/update-user.dto'
import { UpdatePasswordDto } from '../../dto/update-password.dto'
import { ListUsersDto } from '../../dto/list-users.dto'
import { SortDirectionEnum } from '@/shared/domain/repositories/searchble-repository-contracts'
import { formatDateToPtBr } from '@/shared/helpers/format-date-to-pt-br'

describe('UsersController unit tests', () => {
    let sut: UsersController
    let spyNestAdapter: jest.SpyInstance

    beforeEach(() => {
        sut = new UsersController()
        spyNestAdapter = jest.spyOn(
            nestControllerAdapter,
            'nestControllerAdapter',
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should create an user', async () => {
        const body: SignupDto = {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
        }

        const response: SignUpController.Response = {
            statusCode: 201,
            body: {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email',
                createdAt: formatDateToPtBr(new Date()),
                updatedAt: formatDateToPtBr(new Date()),
            },
            error: null,
        }

        spyNestAdapter.mockImplementationOnce(
            () => () => Promise.resolve(response) as any,
        )

        const result = await sut.create(body, {} as FastifyReply)

        expect(result.body).toStrictEqual(response.body)
        expect(result.statusCode).toEqual(201)
        expect(spyNestAdapter).toHaveBeenCalledTimes(1)
    })

    it('should return an user', async () => {
        const response: SignUpController.Response = {
            statusCode: 200,
            body: {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email',
                createdAt: formatDateToPtBr(new Date()),
                updatedAt: formatDateToPtBr(new Date()),
            },
            error: null,
        }

        spyNestAdapter.mockImplementationOnce(
            () => () => Promise.resolve(response) as any,
        )

        const result = await sut.findOne('any_id', {} as FastifyReply)

        expect(result.body).toStrictEqual(response.body)
        expect(result.statusCode).toEqual(200)
        expect(spyNestAdapter).toHaveBeenCalledTimes(1)
    })

    it('should update an user', async () => {
        const body: UpdateUserDto = {
            name: 'new_name',
        }

        const response: UpdateUserController.Response = {
            statusCode: 200,
            body: {
                id: 'any_id',
                name: 'new_name',
                email: 'any_email',
                createdAt: formatDateToPtBr(new Date()),
                updatedAt: formatDateToPtBr(new Date()),
            },
            error: null,
        }

        spyNestAdapter.mockImplementationOnce(
            () => () => Promise.resolve(response) as any,
        )

        const result = await sut.update('any_id', body, {} as FastifyReply)

        expect(result.body).toStrictEqual(response.body)
        expect(result.statusCode).toEqual(200)
        expect(spyNestAdapter).toHaveBeenCalledTimes(1)
    })

    it('should delete an user', async () => {
        const response: DeleteUserController.Response = {
            statusCode: 200,
            body: {
                message: 'User deleted successfully',
            },
            error: null,
        }

        spyNestAdapter.mockImplementationOnce(
            () => () => Promise.resolve(response) as any,
        )

        const result = await sut.remove('any_id', {} as FastifyReply)

        expect(result.body).toStrictEqual(response.body)
        expect(result.statusCode).toEqual(200)
        expect(spyNestAdapter).toHaveBeenCalledTimes(1)
    })

    it('should return a list of users', async () => {
        const body: ListUsersDto = {
            page: 1,
            perPage: 1,
            sort: 'any_sort',
            sortDir: SortDirectionEnum.ASC,
            filter: 'any_filter',
        }

        const response: ListUsersController.Response = {
            statusCode: 200,
            body: {
                data: [
                    {
                        id: 'any_id',
                        name: 'any_name',
                        email: 'any_email',
                        createdAt: formatDateToPtBr(new Date()),
                        updatedAt: formatDateToPtBr(new Date()),
                    },
                ],
                meta: {
                    currentPage: 1,
                    total: 1,
                    lastPage: 1,
                    perPage: 15,
                },
            },
            error: null,
        }

        spyNestAdapter.mockImplementationOnce(
            () => () => Promise.resolve(response) as any,
        )

        const result = await sut.findAll(body, {} as FastifyReply)

        expect(result.body).toStrictEqual(response.body)
        expect(result.statusCode).toEqual(200)
        expect(spyNestAdapter).toHaveBeenCalledTimes(1)
    })

    it('should signin an user', async () => {
        const body: SignInController.Body = {
            email: 'any_email',
            password: 'any_password',
        }

        const response: SignInController.Response = {
            statusCode: 200,
            body: {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email',
                createdAt: formatDateToPtBr(new Date()),
                updatedAt: formatDateToPtBr(new Date()),
            },
            error: null,
        }

        spyNestAdapter.mockImplementationOnce(
            () => () => Promise.resolve(response) as any,
        )

        const result = await sut.signin(body, {} as FastifyReply)

        expect(result.body).toStrictEqual(response.body)
        expect(result.statusCode).toEqual(200)
        expect(spyNestAdapter).toHaveBeenCalledTimes(1)
    })

    it('should update an user password', async () => {
        const body: UpdatePasswordDto = {
            currentPassword: 'any_password',
            newPassword: 'new_password',
        }

        const response: UpdateUserController.Response = {
            statusCode: 200,
            body: {
                id: 'any_id',
                name: 'any_name',
                email: 'any_email',
                createdAt: formatDateToPtBr(new Date()),
                updatedAt: formatDateToPtBr(new Date()),
            },
            error: null,
        }

        spyNestAdapter.mockImplementationOnce(
            () => () => Promise.resolve(response) as any,
        )

        const result = await sut.updatePassword(
            'any_id',
            body,
            {} as FastifyReply,
        )

        expect(result.body).toStrictEqual(response.body)
        expect(result.statusCode).toEqual(200)
        expect(spyNestAdapter).toHaveBeenCalledTimes(1)
    })
})
