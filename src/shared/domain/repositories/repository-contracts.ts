import { NotFoundError } from 'rxjs'
import { Either } from '../contracts/either'
import { Entity } from '../entities/entity'

export interface RepositoryInterface<E extends Entity> {
    insert(entity: E): Promise<void>
    findById(id: string): Promise<Either<NotFoundError, E>>
    findAll(): Promise<E[]>
    update(entity: E): Promise<Either<NotFoundError, E>>
    delete(id: string): Promise<void>
}
