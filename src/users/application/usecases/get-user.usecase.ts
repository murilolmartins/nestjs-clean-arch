import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { Either, left, right } from '@/shared/domain/contracts/either'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UserNotFoundError } from '../errors/user-not-found.error'

export namespace GetUserUseCase {
    export type Input = {
        id: string
    }

    export type Output = UserOutput

    export class UseCase {
        constructor(private readonly repository: UserRepository.Repository) {}

        async execute(
            input: Input,
        ): Promise<Either<UserNotFoundError | BadRequestError, Output>> {
            const { id } = input

            if (!id) {
                return left(new BadRequestError('Missing input fields'))
            }

            const userOrError = await this.repository.findById(id)

            if (userOrError.isLeft()) {
                return left(new UserNotFoundError('id', id))
            }

            const user = userOrError.value

            return right(UserOutputMapper.toOutput(user))
        }
    }
}
