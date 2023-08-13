import { InvalidPasswordError } from '@/shared/application/errors/invalid-password.error'
import { Either, left, right } from '@/shared/domain/contracts/either'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'
import { UseCase as BaseUseCase } from '@/shared/application/usecase/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '../providers/hash.provider'
import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { UserNotFoundError } from '../errors/user-not-found.error'

export namespace UpdatePasswordUseCase {
    export type Input = {
        id: string
        currentPassword: string
        newPassword: string
    }

    export type Output = {
        message: string
    }

    export class UseCase implements BaseUseCase<Input, Output> {
        constructor(
            private readonly repository: UserRepository.Repository,
            private readonly hashProvider: HashProvider,
        ) {}
        async execute(
            input: Input,
        ): Promise<
            Either<
                NotFoundError | InvalidPasswordError | BadRequestError,
                Output
            >
        > {
            const { id, currentPassword, newPassword } = input

            if (!id || !currentPassword || !newPassword) {
                return left(new BadRequestError('Missing input fields'))
            }

            const userOrError = await this.repository.findById(id)

            if (userOrError.isLeft()) {
                return left(new UserNotFoundError('id', id))
            }

            const user = userOrError.value

            const passwordMatch = await this.hashProvider.compareHash(
                currentPassword,
                user.password,
            )

            if (!passwordMatch) {
                return left(new InvalidPasswordError())
            }

            const hashedPassword = await this.hashProvider.generateHash(
                newPassword,
            )

            user.updatePassword(hashedPassword)

            await this.repository.update(user)

            return right({ message: 'Password updated successfully' })
        }
    }
}
