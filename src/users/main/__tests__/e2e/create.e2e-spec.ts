import { UserRepository } from '@/users/domain/repositories/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { SignupDto } from '../../dto/signup.dto'
import { PrismaClient } from '@prisma/client'
import { UsersModule } from '../../users.module'
import { EnvConfigModule } from '@/shared/infra/env-config/env-config.module'
import { DatabaseModule } from '@/shared/infra/database/database.module'
import request from 'supertest'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { prismaConnection } from '@/shared/infra/database/prisma/testing/prisma-connection'
import { UserPresenter } from '@/users/presentation/presenters/user.presenter'
import { applyGlobalConfig } from '@/global-config'

describe('Create e2e tests', () => {
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository
    let signupDto: SignupDto
    let prismaService: PrismaClient

    beforeAll(async () => {
        prismaService = prismaConnection()
        module = await Test.createTestingModule({
            imports: [
                EnvConfigModule,
                UsersModule,
                DatabaseModule.forTest(prismaService),
            ],
        }).compile()

        app = module.createNestApplication()

        applyGlobalConfig(app)

        await app.init()
        repository = module.get<UserRepository.Repository>('UserRepository')
    })
    it('should create a new user', async () => {
        signupDto = UserDataBuilder()

        const response = await request(app.getHttpServer())
            .post('/users')
            .send(signupDto)
            .expect(201)

        expect(response.body.body).toHaveProperty('id')
        expect(response.body.body).toHaveProperty('name', signupDto.name)
        expect(response.body.body).toHaveProperty('email', signupDto.email)
        expect(response.body.body).not.toHaveProperty('password')
        expect(response.body.body).toHaveProperty('createdAt')
        expect(response.body.body).toHaveProperty('updatedAt')
        expect(response.body.error).toBe(null)

        const prismaUser = await prismaService.user.findUnique({
            where: { id: response.body.body.id },
        })

        expect(prismaUser).toHaveProperty('id', response.body.body.id)
        expect(prismaUser).toHaveProperty('name', signupDto.name)
        expect(prismaUser).toHaveProperty('email', signupDto.email)
        expect(prismaUser).toHaveProperty('password')
        expect(prismaUser).toHaveProperty('createdAt')
        expect(prismaUser).toHaveProperty('updatedAt')

        const userEntityOrError = await repository.findById(prismaUser.id)

        expect(userEntityOrError.isRight()).toBeTruthy()

        const userEntity =
            userEntityOrError.isRight() && userEntityOrError.value

        const presenter = new UserPresenter(userEntity.toJSON())

        expect(presenter.toPresentation()).toStrictEqual(response.body.body)
    })

    it('should return error with 422 code when request body is invalid', async () => {
        const response = await request(app.getHttpServer())
            .post('/users')
            .send({})
            .expect(422)

        expect(response.body).toStrictEqual({
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
                'email should not be empty',
                'email must be a string',
                'email must be an email',
                'password should not be empty',
                'password must be longer than or equal to 8 characters',
            ],
        })
    })
})
