import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contracts'

export interface SeachRepositoryInterface<
    E extends Entity,
    SearchInput,
    SearchOutput,
> extends RepositoryInterface<E> {
    search(searchInput: SearchInput): Promise<SearchOutput>
}
