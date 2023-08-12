import { BadRequestError } from '@/shared/application/errors/bad-request.error'
import { Either, left, right } from '@/shared/domain/contracts/either'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'

export namespace UpdateUserUseCase {
    export type Input = {
        id: string
        name?: string
    }

    export type Output = UserOutput

    export class UseCase {
        constructor(private readonly repository: UserRepository.Repository) {}

        async execute(
            input: Input,
        ): Promise<Either<NotFoundError | BadRequestError, Output>> {
            const { id } = input

            if (!id) {
                return left(new BadRequestError('Missing input fields'))
            }

            const userOrError = await this.repository.findById(id)

            if (userOrError.isLeft()) {
                return left(userOrError.value)
            }

            const user = userOrError.value

            if (input.name) {
                user.updateName(input.name)
            }

            await this.repository.update(user)

            return right(UserOutputMapper.toOutput(user))
        }
    }
}
