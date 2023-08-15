import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '@/users/application/providers/hash.provider'
import { SignUpController } from '@/users/presentation/controllers'

export const SignUpControllerFactory = (
    repository: UserRepository.Repository,
    hashProvider: HashProvider,
) => {
    const useCase = new SignupUseCase.UseCase(repository, hashProvider)
    return new SignUpController.Controller(useCase)
}
