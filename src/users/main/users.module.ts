import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { SignUpController } from '../presentation/controllers/signup.controller'
import { BcryptHashProvider } from '../infra/providers/hash/bccrypt-hash.provider'
import { SignInController } from '../presentation/controllers/signin.controller'
import { GetUserController } from '../presentation/controllers/get-user.controller'
import { ListUsersController } from '../presentation/controllers/list-user.controller'
import { DeleteUserController } from '../presentation/controllers/delete-user.controller'
import { UpdateUserController } from '../presentation/controllers/update-user.controller'
import { UpdatePasswordController } from '../presentation/controllers/update-password.controller'
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service'
import { UserPrismaRepository } from '../infra/database/prisma/repositories/user-prisma.repository'
import { SignUpControllerFactory } from './factories/signup-controller.factory'
import {
    DeleteUserControllerFactory,
    GetUserControllerFactory,
    ListUsersControllerFactory,
    SignInControllerFactory,
    UpdatePasswordControllerFactory,
    UpdateUserControllerFactory,
} from './factories'

@Module({
    controllers: [UsersController],
    providers: [
        {
            provide: 'PrismaService',
            useClass: PrismaService,
        },
        {
            provide: 'UserRepository',
            useFactory: (prismaService: PrismaService) => {
                return new UserPrismaRepository(prismaService)
            },
            inject: ['PrismaService'],
        },
        {
            provide: 'HashProvider',
            useClass: BcryptHashProvider,
        },
        {
            provide: SignUpController.Controller,
            useFactory: SignUpControllerFactory,
            inject: ['UserRepository', 'HashProvider'],
        },
        {
            provide: SignInController.Controller,
            useFactory: SignInControllerFactory,
            inject: ['UserRepository', 'HashProvider'],
        },
        {
            provide: GetUserController.Controller,
            useFactory: GetUserControllerFactory,
            inject: ['UserRepository'],
        },
        {
            provide: ListUsersController.Controller,
            useFactory: ListUsersControllerFactory,
            inject: ['UserRepository'],
        },
        {
            provide: DeleteUserController.Controller,
            useFactory: DeleteUserControllerFactory,
            inject: ['UserRepository'],
        },
        {
            provide: UpdateUserController.Controller,
            useFactory: UpdateUserControllerFactory,
            inject: ['UserRepository'],
        },
        {
            provide: UpdatePasswordController.Controller,
            useFactory: UpdatePasswordControllerFactory,
            inject: ['UserRepository', 'HashProvider'],
        },
    ],
})
export class UsersModule {}
