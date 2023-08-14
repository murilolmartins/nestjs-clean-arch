import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { HashProviderEnum, HashProviderMap } from '../providers/hash/hash'
import { UserRepositoryEnum, UserRepositoryMap } from '../database/repository'

export const SingUpUseCaseInMemoryFactory = (
    repository: UserRepositoryEnum = UserRepositoryEnum.IN_MEMORY,
    hash: HashProviderEnum = HashProviderEnum.BCRYPT,
) => {
    const userRepository = UserRepositoryMap[repository]
    const hashProvider = HashProviderMap[hash]
    return new SignupUseCase.UseCase(userRepository, hashProvider)
}
