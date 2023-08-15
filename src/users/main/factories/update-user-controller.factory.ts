import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UpdateUserController } from '@/users/presentation/controllers'

export const UpdateUserControllerFactory = (
    repository: UserRepository.Repository,
) => {
    const useCase = new UpdateUserUseCase.UseCase(repository)
    return new UpdateUserController.Controller(useCase)
}
