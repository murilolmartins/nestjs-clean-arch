import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { Either, left, right } from '@/shared/domain/contracts/either'
import { EntityValidationError } from '@/shared/domain/errors/validation.error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '../providers/hash.provider'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase as BaseUseCase } from '@/shared/application/usecase/use-case'

export namespace SignupUseCase {
    export interface Input {
        name: string
        email: string
        password: string
    }

    export type Output = UserOutput

    export class UseCase implements BaseUseCase<Input, Output> {
        constructor(
            private readonly userRepository: UserRepository.Repository,
            private readonly hashProvider: HashProvider,
        ) {}
        async execute(
            input: Input,
        ): Promise<Either<BadRequestError | EntityValidationError, Output>> {
            const { name, email, password } = input

            if (!name || !email || !password) {
                return left(new BadRequestError('Missing fields'))
            }

            const emailAlreadyExist = await this.userRepository.emailExists(
                email,
            )

            if (emailAlreadyExist.isLeft()) {
                return left(emailAlreadyExist.value)
            }

            const hashedPassword = await this.hashProvider.generateHash(
                password,
            )

            const userOrError = UserEntity.create({
                ...input,
                password: hashedPassword,
            })

            if (userOrError.isLeft()) {
                return left(userOrError.value)
            }

            await this.userRepository.insert(userOrError.value)

            return right(UserOutputMapper.toOutput(userOrError.value))
        }
    }
}
