import { Entity } from '../../entity'

describe('Entity unit tests', () => {
    class StubEntity extends Entity<{ name: string }> {
        constructor(props: { name: string }, id?: string) {
            super(props, id)
        }

        get name(): string {
            return this.props.name
        }
    }

    test('Create instance', () => {
        const sut = new Entity({})

        expect(sut.createdAt).toBeInstanceOf(Date)
        expect(sut.updatedAt).toBeInstanceOf(Date)
        expect(sut.id).toBeDefined()
    })

    test('Create instance with props', () => {
        const props = {
            name: 'any_name',
        }

        const sut = new Entity(props)

        expect(sut.createdAt).toBeInstanceOf(Date)
        expect(sut.updatedAt).toBeInstanceOf(Date)
        expect(sut.id).toBeDefined()
        expect(sut.props).toStrictEqual(props)
    })

    test('toJSON method', () => {
        const sut = new Entity({})

        const json = sut.toJSON()

        expect(json).toHaveProperty('id')
        expect(json).toHaveProperty('createdAt')
        expect(json).toHaveProperty('updatedAt')
    })

    test('Create instance of StubEntity', () => {
        const props = {
            name: 'any_name',
        }

        const sut = new StubEntity(props)

        expect(sut.createdAt).toBeInstanceOf(Date)
        expect(sut.updatedAt).toBeInstanceOf(Date)
        expect(sut.id).toBeDefined()
        expect(sut.props).toStrictEqual(props)
        expect(sut.name).toEqual(props.name)
    })

    test('if id is invalid, shoulf create entity with a valid one', () => {
        const props = {
            name: 'any_name',
        }

        const id = 'invalid_id'

        const sut = new StubEntity(props, 'invalid_id')

        expect(sut.createdAt).toBeInstanceOf(Date)
        expect(sut.updatedAt).toBeInstanceOf(Date)
        expect(sut.id).toBeDefined()
        expect(sut.id).not.toEqual(id)
        expect(sut.props).toStrictEqual(props)
        expect(sut.name).toEqual(props.name)
    })
})
