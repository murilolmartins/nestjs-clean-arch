import { Either } from '../contracts/either'
import { Entity } from '../entities/entity'
import { NotFoundError } from '../errors/not-found.error'

export interface RepositoryInterface<E extends Entity> {
    insert(entity: E): Promise<void>
    findById(id: string): Promise<Either<NotFoundError, E>>
    findAll(): Promise<E[]>
    update(entity: E): Promise<void>
    delete(id: string): Promise<void>
}
