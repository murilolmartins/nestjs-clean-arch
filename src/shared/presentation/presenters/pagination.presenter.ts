export interface PaginationPresenterView {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
}

export interface PaginationPresenterProps {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
}

export class PaginationPresenter {
    total: number
    currentPage: number
    lastPage: number
    perPage: number

    constructor(pagination: PaginationPresenterProps) {
        this.total = Number(pagination.total)
        this.currentPage = Number(pagination.currentPage)
        this.lastPage = Number(pagination.lastPage)
        this.perPage = Number(pagination.perPage)
    }

    toPresentation = (): PaginationPresenterView => {
        return {
            total: this.total,
            currentPage: this.currentPage,
            lastPage: this.lastPage,
            perPage: this.perPage,
        }
    }
}
