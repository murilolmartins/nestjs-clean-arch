import { SearchResult } from '@/shared/domain/repositories/searchble-repository-contracts'
import { PaginationOutputMapper } from '../pagination-output'

describe('PaginationOutputMapper unit tests', () => {
    it('Should return a PaginationOutput', () => {
        const items = [
            {
                id: 'any_id',
                name: 'any_name',
                price: 10,
            },
        ]

        const searchResult = new SearchResult({
            items: items as any,
            total: 1,
            currentPage: 1,
            perPage: 1,
            filter: null,
            sort: null,
            sortDir: null,
        })

        const sut = PaginationOutputMapper.toOutput(items, searchResult)

        expect(sut).toStrictEqual({
            items,
            total: 1,
            currentPage: 1,
            lastPage: 1,
            perPage: 1,
        })
    })
})
