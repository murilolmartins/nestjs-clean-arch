import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '@/users/application/providers/hash.provider'
import { UpdatePasswordController } from '@/users/presentation/controllers'

export const UpdatePasswordControllerFactory = (
    repository: UserRepository.Repository,
    hashProvider: HashProvider,
) => {
    const useCase = new UpdatePasswordUseCase.UseCase(repository, hashProvider)
    return new UpdatePasswordController.Controller(useCase)
}
