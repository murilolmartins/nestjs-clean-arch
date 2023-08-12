import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory-repository'
import { NotFoundError } from '@/shared/domain/errors/not-found.error'

interface StubProps {
    name: string
    price: number
}

class StubEntity extends Entity<StubProps> {
    constructor(
        public readonly props: StubProps,
        id?: string,
    ) {
        super(props, id)
    }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository unit tests', () => {
    let sut: StubInMemoryRepository

    beforeEach(() => {
        sut = new StubInMemoryRepository()
    })

    test('Insert entity', async () => {
        const props = {
            name: 'any_name',
            price: 10,
        }

        const entity = new StubEntity(props)

        await sut.insert(entity)

        expect(sut.entities).toHaveLength(1)
        expect(sut.entities[0].toJSON()).toStrictEqual(entity.toJSON())
    })

    test('Find entity by id', async () => {
        const props = {
            name: 'any_name',
            price: 10,
        }

        const entity = new StubEntity(props)

        await sut.insert(entity)

        const result = await sut.findById(entity.id)

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual(entity)
    })

    it('Should return NotFoundError on find if entity id does not exist', async () => {
        const result = await sut.findById('wrong_id')

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
        expect(result.value).toHaveProperty('message', 'Entity not found')
    })

    test('Find all entities', async () => {
        const props = {
            name: 'any_name',
            price: 10,
        }

        const entity = new StubEntity(props)

        await sut.insert(entity)

        const result = await sut.findAll()

        expect(result).toStrictEqual([entity])
    })

    test('Update entity', async () => {
        const props = {
            name: 'any_name',
            price: 10,
        }

        const entity = new StubEntity(props)

        await sut.insert(entity)

        const newProps = {
            name: 'new_name',
            price: 20,
        }

        const entityUpdated = new StubEntity(newProps, entity.id)

        await sut.update(entityUpdated)

        const result = await sut.findById(entity.id)

        expect(result.isRight()).toBeTruthy()
        expect(result.value).toStrictEqual(entityUpdated)
        expect(result.value).not.toStrictEqual(entity)
    })

    it('Should return NotFoundError on update if entity id does not exist', async () => {
        const props = {
            name: 'any_name',
            price: 10,
        }

        const entity = new StubEntity(props)

        const result = await sut.update(entity)

        expect(result.isLeft()).toBeTruthy()
        expect(result.value).toBeInstanceOf(NotFoundError)
        expect(result.value).toHaveProperty('message', 'Entity not found')
    })

    test('Delete entity', async () => {
        const props = {
            name: 'any_name',
            price: 10,
        }

        const entity = new StubEntity(props)

        await sut.insert(entity)

        expect(sut.entities).toHaveLength(1)

        await sut.delete(entity.id)

        expect(sut.entities).toHaveLength(0)
    })
})
