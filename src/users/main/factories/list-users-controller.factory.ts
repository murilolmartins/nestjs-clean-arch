import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { ListUsersController } from '@/users/presentation/controllers'

export const ListUsersControllerFactory = (
    respository: UserRepository.Repository,
) => {
    const useCase = new ListUsersUseCase.UseCase(respository)
    return new ListUsersController.Controller(useCase)
}
