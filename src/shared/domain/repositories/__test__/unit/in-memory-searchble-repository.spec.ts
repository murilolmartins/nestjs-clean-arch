import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchbleRepository } from '../../in-memory-searchble-repository'
import { faker } from '@faker-js/faker'
import {
    SearchParams,
    SearchResult,
    SortDirectionEnum,
} from '../../searchble-repository-contracts'

class StubEntity extends Entity {
    constructor(public readonly props: { name: string }) {
        super(props)
    }
}

class StubInMemorySearchbleRepository extends InMemorySearchbleRepository<StubEntity> {
    sortableFields: string[] = ['name']

    protected async applyFilter(
        items: StubEntity[],
        filter: string | null,
    ): Promise<StubEntity[]> {
        if (!filter) {
            return items
        }

        return items.filter(item =>
            item.props.name
                .toLocaleLowerCase()
                .includes(filter.toLocaleLowerCase()),
        )
    }
}

describe('InMemorySearchbleRepository unit tests', () => {
    let sut: StubInMemorySearchbleRepository

    beforeEach(() => {
        sut = new StubInMemorySearchbleRepository()
    })

    describe('Applyfilter method', () => {
        it('should return all items if filter is null', async () => {
            const items = [
                new StubEntity({ name: faker.person.firstName() }),
                new StubEntity({ name: faker.person.firstName() }),
                new StubEntity({ name: faker.person.firstName() }),
            ]

            const result = await sut['applyFilter'](items, null)
            const spyFilter = jest.spyOn(items, 'filter')

            expect(result).toHaveLength(items.length)
            expect(result).toStrictEqual(items)
            expect(spyFilter).toBeCalledTimes(0)
        })

        it('should return items filtered by name if filter is name', async () => {
            const fixtures = [
                { name: 'Murilo' },
                { name: 'murilo' },
                { name: 'Ana' },
            ]

            const items = fixtures.map(fixture => new StubEntity(fixture))
            const spyFilter = jest.spyOn(items, 'filter')

            let result = await sut['applyFilter'](items, 'Murilo')

            expect(result).toHaveLength(2)
            expect(result[0].props.name).toEqual('Murilo')
            expect(result[1].props.name).toEqual('murilo')

            result = await sut['applyFilter'](items, 'murilo')

            expect(result).toHaveLength(2)
            expect(result[0].props.name).toEqual('Murilo')
            expect(result[1].props.name).toEqual('murilo')
            expect(spyFilter).toBeCalledTimes(2)
        })
    })

    describe('ApplySort method', () => {
        let items: StubEntity[]
        let fixtures: { name: string }[]

        beforeAll(() => {
            fixtures = [{ name: 'Jorge' }, { name: 'Murilo' }, { name: 'Ana' }]

            items = fixtures.map(fixture => new StubEntity(fixture))
        })

        it('should not sort if sort is null and sortDir is null', async () => {
            const result = await sut['applySort'](items, null, null)

            expect(result).toHaveLength(3)
            expect(result[0].props.name).toEqual('Jorge')
            expect(result[1].props.name).toEqual('Murilo')
            expect(result[2].props.name).toEqual('Ana')
        })

        it("should not sort if sort is not in sortableFields and sortDir is 'asc'", async () => {
            const result = await sut['applySort'](items, 'test', 'asc')

            expect(result).toHaveLength(3)
            expect(result[0].props.name).toEqual('Jorge')
            expect(result[1].props.name).toEqual('Murilo')
            expect(result[2].props.name).toEqual('Ana')
        })

        it("should return items sorted by name if sort is 'name'", async () => {
            const result = await sut['applySort'](items, 'name', 'asc')

            expect(result).toHaveLength(3)
            expect(result[0].props.name).toEqual('Ana')
            expect(result[1].props.name).toEqual('Jorge')
            expect(result[2].props.name).toEqual('Murilo')
        })

        it("should return items sorted by name if sort is 'name' and sortDir is 'desc'", async () => {
            const result = await sut['applySort'](items, 'name', 'desc')

            expect(result).toHaveLength(3)
            expect(result[0].props.name).toEqual('Murilo')
            expect(result[1].props.name).toEqual('Jorge')
            expect(result[2].props.name).toEqual('Ana')
        })
    })

    describe('ApplyPaginate method', () => {
        let items: StubEntity[]
        let fixtures: { name: string }[]

        beforeAll(() => {
            fixtures = [{ name: 'Jorge' }, { name: 'Murilo' }, { name: 'Ana' }]

            items = fixtures.map(fixture => new StubEntity(fixture))
        })

        it('should return all items if page is 1 and perPage is 3', async () => {
            const result = await sut['applyPaginate'](items, 1, 3)

            expect(result).toHaveLength(3)
            expect(result[0].props.name).toEqual('Jorge')
            expect(result[1].props.name).toEqual('Murilo')
            expect(result[2].props.name).toEqual('Ana')
        })

        it('should return first item if page is 1 and perPage is 1', async () => {
            const result = await sut['applyPaginate'](items, 1, 1)

            expect(result).toHaveLength(1)
            expect(result[0].props.name).toEqual('Jorge')
        })

        it('should return second item if page is 2 and perPage is 1', async () => {
            const result = await sut['applyPaginate'](items, 2, 1)

            expect(result).toHaveLength(1)
            expect(result[0].props.name).toEqual('Murilo')
        })

        it('should return empty array if page is 3 and perPage is 3', async () => {
            const result = await sut['applyPaginate'](items, 3, 3)

            expect(result).toHaveLength(0)
        })
    })

    describe('Search method', () => {
        it('should apply only pagination when the other params are null', async () => {
            const entity = new StubEntity({ name: 'test' })
            const items = Array(16).fill(entity)
            sut.entities = items

            const params = await sut.search(new SearchParams())
            expect(params).toStrictEqual(
                new SearchResult({
                    items: Array(15).fill(entity),
                    total: 16,
                    currentPage: 1,
                    perPage: 15,
                    sort: null,
                    sortDir: null,
                    filter: null,
                }),
            )
        })

        it('should apply paginate and filter', async () => {
            const items = [
                new StubEntity({ name: 'test' }),
                new StubEntity({ name: 'a' }),
                new StubEntity({ name: 'TEST' }),
                new StubEntity({ name: 'TeSt' }),
            ]
            sut.entities = items

            let params = await sut.search(
                new SearchParams({
                    page: 1,
                    perPage: 2,
                    filter: 'TEST',
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[0], items[2]],
                    total: 3,
                    currentPage: 1,
                    perPage: 2,
                    sort: null,
                    sortDir: null,
                    filter: 'TEST',
                }),
            )

            params = await sut.search(
                new SearchParams({
                    page: 2,
                    perPage: 2,
                    filter: 'TEST',
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[3]],
                    total: 3,
                    currentPage: 2,
                    perPage: 2,
                    sort: null,
                    sortDir: null,
                    filter: 'TEST',
                }),
            )
        })

        it('should apply paginate and sort', async () => {
            const items = [
                new StubEntity({ name: 'b' }),
                new StubEntity({ name: 'a' }),
                new StubEntity({ name: 'd' }),
                new StubEntity({ name: 'e' }),
                new StubEntity({ name: 'c' }),
            ]
            sut.entities = items

            let params = await sut.search(
                new SearchParams({
                    page: 1,
                    perPage: 2,
                    sort: 'name',
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[3], items[2]],
                    total: 5,
                    currentPage: 1,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'desc',
                    filter: null,
                }),
            )

            params = await sut.search(
                new SearchParams({
                    page: 2,
                    perPage: 2,
                    sort: 'name',
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[4], items[0]],
                    total: 5,
                    currentPage: 2,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'desc',
                    filter: null,
                }),
            )

            params = await sut.search(
                new SearchParams({
                    page: 1,
                    perPage: 2,
                    sort: 'name',
                    sortDir: SortDirectionEnum.ASC,
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[1], items[0]],
                    total: 5,
                    currentPage: 1,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'asc',
                    filter: null,
                }),
            )

            params = await sut.search(
                new SearchParams({
                    page: 3,
                    perPage: 2,
                    sort: 'name',
                    sortDir: SortDirectionEnum.ASC,
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[3]],
                    total: 5,
                    currentPage: 3,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'asc',
                    filter: null,
                }),
            )
        })

        it('should search using paginate, sort and filter', async () => {
            const items = [
                new StubEntity({ name: 'test' }),
                new StubEntity({ name: 'a' }),
                new StubEntity({ name: 'TEST' }),
                new StubEntity({ name: 'e' }),
                new StubEntity({ name: 'TeSt' }),
            ]
            sut.entities = items

            let params = await sut.search(
                new SearchParams({
                    page: 1,
                    perPage: 2,
                    sort: 'name',
                    filter: 'TEST',
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[0], items[4]],
                    total: 3,
                    currentPage: 1,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'desc',
                    filter: 'TEST',
                }),
            )

            params = await sut.search(
                new SearchParams({
                    page: 2,
                    perPage: 2,
                    sort: 'name',
                    filter: 'TEST',
                }),
            )
            expect(params).toStrictEqual(
                new SearchResult({
                    items: [items[2]],
                    total: 3,
                    currentPage: 2,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'desc',
                    filter: 'TEST',
                }),
            )
        })
    })
})
