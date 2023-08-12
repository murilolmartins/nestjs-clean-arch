import {
    PaginationOutput,
    PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'
import { SearchInput } from '@/shared/application/dtos/search-input'
import { UseCase as BaseUseCase } from '@/shared/application/usecase/use-case'
import { Either, right } from '@/shared/domain/contracts/either'
import { SearchResult } from '@/shared/domain/repositories/searchble-repository-contracts'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repositories/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'

export namespace ListUsersUseCase {
    export type Input = SearchInput

    export type Output = PaginationOutput<UserOutput>

    export class UseCase implements BaseUseCase<Input, Output> {
        constructor(private readonly repository: UserRepository.Repository) {}
        async execute(input: Input): Promise<Either<void, Output>> {
            const params = new UserRepository.SearchParams(input)

            const users = await this.repository.search(params)

            return right(this.toOutput(users))
        }

        private toOutput(searchResult: SearchResult<UserEntity>): Output {
            const items = searchResult.items.map(user =>
                UserOutputMapper.toOutput(user),
            )
            return PaginationOutputMapper.toOutput(items, searchResult)
        }
    }
}
