import { Either, left, right } from '@/shared/domain/contracts/either'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase as BaseUseCase } from '@/shared/application/usecase/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '../providers/hash.provider'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials'

export namespace SignInUseCase {
    export type Input = {
        email: string
        password: string
    }

    export type Output = UserOutput

    export class UseCase implements BaseUseCase<Input, Output> {
        constructor(
            private readonly repository: UserRepository.Repository,
            private readonly hashProvider: HashProvider,
        ) {}
        async execute(
            input: Input,
        ): Promise<Either<BadRequestError | InvalidCredentialsError, Output>> {
            const { email, password } = input

            if (!email || !password) {
                return left(new BadRequestError('Missing input fields'))
            }

            const userOrError = await this.repository.findByEmail(email)

            if (userOrError.isLeft()) {
                return left(new InvalidCredentialsError())
            }

            const user = userOrError.value

            const passwordMatch = await this.hashProvider.compareHash(
                password,
                user.password,
            )

            if (!passwordMatch) {
                return left(new InvalidCredentialsError())
            }

            return right(UserOutputMapper.toOutput(user))
        }
    }
}
