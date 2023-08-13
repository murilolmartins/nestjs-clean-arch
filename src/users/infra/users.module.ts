import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { SignUpController } from '../presentation/controllers/signup.controller'
import { UserInMemoryRepository } from './repositories/userInMemory.repository'
import { BcryptHashProvider } from './providers/hash/bccrypt-hash.provider'
import { SignupUseCase } from '../application/usecases/signup.usecase'
import { UserRepository } from '../domain/repositories/user.repository'
import { HashProvider } from '../application/providers/hash.provider'
import { SignInController } from '../presentation/controllers/signin.controller'
import { SignInUseCase } from '../application/usecases/signin.usecase'
import { GetUserController } from '../presentation/controllers/get-user.controller'
import { GetUserUseCase } from '../application/usecases/get-user.usecase'
import { ListUsersController } from '../presentation/controllers/list-user.controller'
import { ListUsersUseCase } from '../application/usecases/list-users.usecase'
import { DeleteUserController } from '../presentation/controllers/delete-user.controller'
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase'
import { UpdateUserController } from '../presentation/controllers/update-user.controller'
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase'
import { UpdatePasswordController } from '../presentation/controllers/update-password.controller'
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase'

@Module({
    controllers: [UsersController],
    providers: [
        {
            provide: 'UserRepository',
            useClass: UserInMemoryRepository,
        },
        {
            provide: 'HashProvider',
            useClass: BcryptHashProvider,
        },
        {
            provide: SignUpController.Controller,
            useFactory: (
                userRepository: UserRepository.Repository,
                hashProvider: HashProvider,
            ) => {
                const useCase = new SignupUseCase.UseCase(
                    userRepository,
                    hashProvider,
                )
                return new SignUpController.Controller(useCase)
            },
            inject: ['UserRepository', 'HashProvider'],
        },
        {
            provide: SignInController.Controller,
            useFactory: (
                userRepository: UserRepository.Repository,
                hashProvider: HashProvider,
            ) => {
                const useCase = new SignInUseCase.UseCase(
                    userRepository,
                    hashProvider,
                )
                return new SignInController.Controller(useCase)
            },
            inject: ['UserRepository', 'HashProvider'],
        },
        {
            provide: GetUserController.Controller,
            useFactory: (userRepository: UserRepository.Repository) => {
                const useCase = new GetUserUseCase.UseCase(userRepository)
                return new GetUserController.Controller(useCase)
            },
            inject: ['UserRepository'],
        },
        {
            provide: ListUsersController.Controller,
            useFactory: (userRepository: UserRepository.Repository) => {
                const useCase = new ListUsersUseCase.UseCase(userRepository)
                return new ListUsersController.Controller(useCase)
            },
            inject: ['UserRepository'],
        },
        {
            provide: DeleteUserController.Controller,
            useFactory: (userRepository: UserRepository.Repository) => {
                const useCase = new DeleteUserUseCase.UseCase(userRepository)
                return new DeleteUserController.Controller(useCase)
            },
            inject: ['UserRepository'],
        },
        {
            provide: UpdateUserController.Controller,
            useFactory: (userRepository: UserRepository.Repository) => {
                const useCase = new UpdateUserUseCase.UseCase(userRepository)
                return new UpdateUserController.Controller(useCase)
            },
            inject: ['UserRepository'],
        },
        {
            provide: UpdatePasswordController.Controller,
            useFactory: (
                userRepository: UserRepository.Repository,
                hashProvider: HashProvider,
            ) => {
                const useCase = new UpdatePasswordUseCase.UseCase(
                    userRepository,
                    hashProvider,
                )
                return new UpdatePasswordController.Controller(useCase)
            },
            inject: ['UserRepository', 'HashProvider'],
        },
    ],
})
export class UsersModule {}
