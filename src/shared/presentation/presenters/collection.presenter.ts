import {
    PaginationPresenter,
    PaginationPresenterProps,
    PaginationPresenterView,
} from './pagination.presenter'

export interface CollectionPresenterProps<Output> {
    items: Output[]
}

export interface CollectionPresenterToPresentation<ViewItem> {
    meta: PaginationPresenterView
    data: ViewItem[]
}

export abstract class CollectionPresenter<PresentationItem> {
    public readonly meta: PaginationPresenterView

    constructor(public readonly props: PaginationPresenterProps) {
        this.meta = new PaginationPresenter(props).toPresentation()
    }

    abstract toPresentation(): CollectionPresenterToPresentation<PresentationItem>
}
