/* eslint-disable @typescript-eslint/no-namespace */
import { Either } from '@/shared/domain/contracts/either'
import { UserEntity } from '../entities/user.entity'
import {
    SeachRepositoryInterface,
    SearchParams as DefaultSearchParams,
    SearchResult as DefaultSearchResult,
} from '@/shared/domain/repositories/searchble-repository-contracts'
import { ConflictError } from '@/shared/domain/errors/conflict.error'
import { NotFoundError } from 'rxjs'

export type EmailExistsReturn = Promise<Either<ConflictError, null>>

export type FindByEmailReturn = Promise<Either<NotFoundError, UserEntity>>

export namespace UserRepository {
    export type Filter = string
    export class SearchParams extends DefaultSearchParams<Filter> {}
    export class SearchResult extends DefaultSearchResult<UserEntity, Filter> {}
    export interface Repository
        extends SeachRepositoryInterface<
            UserEntity,
            Filter,
            SearchParams,
            SearchResult
        > {
        findByEmail(email: string): FindByEmailReturn
        emailExists(email: string): EmailExistsReturn
    }
}
