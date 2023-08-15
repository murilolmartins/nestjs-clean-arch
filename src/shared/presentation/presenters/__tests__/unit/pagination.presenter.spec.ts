import { PaginationPresenter } from '../../pagination.presenter'

describe('PaginationPresenter unit tests ', () => {
    it('should return 1 page when total is 10 and limit is 10', () => {
        const sut = new PaginationPresenter({
            total: 10,
            currentPage: 1,
            lastPage: 2,
            perPage: 5,
        })

        expect(sut.total).toBe(10)
        expect(sut.currentPage).toBe(1)
        expect(sut.lastPage).toBe(2)
        expect(sut.perPage).toBe(5)
    })

    it('should return numbers if props are strings', () => {
        const sut = new PaginationPresenter({
            total: '10' as any,
            currentPage: '1' as any,
            lastPage: '2' as any,
            perPage: '5' as any,
        })

        expect(sut.total).toBe(10)
        expect(sut.currentPage).toBe(1)
        expect(sut.lastPage).toBe(2)
        expect(sut.perPage).toBe(5)
    })
})
