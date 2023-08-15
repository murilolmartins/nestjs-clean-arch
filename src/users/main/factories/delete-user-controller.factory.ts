import { DeleteUserUseCase } from '@/users/application/usecases/delete-user.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { DeleteUserController } from '@/users/presentation/controllers'

export const DeleteUserControllerFactory = (
    repository: UserRepository.Repository,
) => {
    const useCase = new DeleteUserUseCase.UseCase(repository)
    return new DeleteUserController.Controller(useCase)
}
