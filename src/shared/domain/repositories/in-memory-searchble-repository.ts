import { Entity } from '../entities/entity'
import { InMemoryRepository } from './in-memory-repository'
import { SeachRepositoryInterface } from './searchble-repository-contracts'

export abstract class InMemorySearchbleRepository<E extends Entity>
    extends InMemoryRepository<E>
    implements SeachRepositoryInterface<E, any, any>
{
    async search(searchInput: any): Promise<any> {
        throw new Error('Method not implemented.')
    }
}
