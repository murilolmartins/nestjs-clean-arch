import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'
import { UserRepositoryEnum, UserRepositoryMap } from '../database/repository'

export const GetUserUseCaseInMemoryFactory = (
    repository: UserRepositoryEnum,
) => {
    const userRepository = UserRepositoryMap[repository]
    return new GetUserUseCase.UseCase(userRepository)
}
