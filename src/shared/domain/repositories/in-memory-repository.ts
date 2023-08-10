import { Entity } from '../entities/entity'
import { NotFoundError } from '../errors/not-found-error'
import { RepositoryInterface } from './repository-contracts'

export abstract class InMemoryRepository<E extends Entity>
    implements RepositoryInterface<E>
{
    public readonly entities: E[] = []

    async insert(entity: E): Promise<void> {
        this.entities.push(entity)
    }

    async findById(id: string): Promise<E | undefined> {
        return this._get(id)
    }

    async findAll(): Promise<E[]> {
        return this.entities
    }

    async update(entity: E): Promise<void> {
        const index = await this._getIndexOf(entity.id)
        this.entities[index] = entity
    }

    async delete(id: string): Promise<void> {
        const index = await this._getIndexOf(id)
        this.entities.splice(index, 1)
    }

    protected async _get(id: string): Promise<E> {
        const _id = `${id}`

        const entity = this.entities.find(entity => entity.id === _id)

        if (!entity) {
            throw new NotFoundError('Entity not found')
        }

        return entity
    }

    protected async _getIndexOf(id: string): Promise<number> {
        await this._get(id)

        return this.entities.findIndex(entity => entity.id === id)
    }
}
