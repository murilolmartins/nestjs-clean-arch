import { PaginationPresenterView } from '@/shared/presentation/presenters/pagination.presenter'
import { UserView } from './user-view'
import { CollectionPresenterToPresentation } from '@/shared/presentation/presenters/collection.presenter'

export interface UsersCollectionView
    extends CollectionPresenterToPresentation<UserView> {
    data: UserView[]
    meta: PaginationPresenterView
}
