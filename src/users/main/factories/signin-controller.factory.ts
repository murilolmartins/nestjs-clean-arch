import { SignInUseCase } from '@/users/application/usecases/signin.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '@/users/application/providers/hash.provider'
import { SignInController } from '@/users/presentation/controllers'

export const SignInControllerFactory = (
    repository: UserRepository.Repository,
    hashProvider: HashProvider,
) => {
    const useCase = new SignInUseCase.UseCase(repository, hashProvider)
    return new SignInController.Controller(useCase)
}
