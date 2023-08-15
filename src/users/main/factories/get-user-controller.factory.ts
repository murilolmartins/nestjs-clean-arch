import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { GetUserController } from '@/users/presentation/controllers'

export const GetUserControllerFactory = (
    repository: UserRepository.Repository,
) => {
    const useCase = new GetUserUseCase.UseCase(repository)
    return new GetUserController.Controller(useCase)
}
