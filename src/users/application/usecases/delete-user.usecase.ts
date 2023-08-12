import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { UseCase as BaseUseCase } from '@/shared/application/usecase/use-case'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserNotFoundError } from '../errors/user-not-found.error'
import { Either, left, right } from '@/shared/domain/contracts/either'

export namespace DeleteUserUsecase {
    export type Input = {
        id: string
    }

    export type Output = {
        message: string
    }

    export class UseCase implements BaseUseCase<Input, Output> {
        constructor(private readonly repository: UserRepository.Repository) {}
        async execute(
            input: Input,
        ): Promise<Either<BadRequestError | UserNotFoundError, Output>> {
            if (!input.id) {
                return left(new BadRequestError('Missing input fields'))
            }

            const userOrError = await this.repository.findById(input.id)

            if (userOrError.isLeft()) {
                return left(new UserNotFoundError('id', input.id))
            }

            await this.repository.delete(input.id)

            return right({ message: 'User deleted successfully' })
        }
    }
}
