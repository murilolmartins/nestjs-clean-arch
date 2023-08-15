import { CollectionPresenter } from '@/shared/presentation/presenters/collection.presenter'
import { UserView } from '../dtos/user-view'
import { PaginationOutput } from '@/shared/application/dtos/pagination-output'
import { UserOutput } from '@/users/application/dto/user-output'
import { UserPresenter } from './user.presenter'
import { UsersCollectionView } from '../dtos/users-collection-view'

export type UserCollectionPresenterProps = PaginationOutput<UserOutput>

export class UserCollectionPresenter extends CollectionPresenter<UserView> {
    public readonly data: UserView[]
    constructor(protected readonly pagination: UserCollectionPresenterProps) {
        super({
            currentPage: pagination.currentPage,
            lastPage: pagination.lastPage,
            perPage: pagination.perPage,
            total: pagination.total,
        })
        this.data = pagination.items.map(user =>
            new UserPresenter(user).toPresentation(),
        )
    }

    toPresentation(): UsersCollectionView {
        return {
            data: this.data,
            meta: this.meta,
        }
    }
}
