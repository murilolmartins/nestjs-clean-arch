import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import {
    HttpRequest,
    HttpResponse,
    ok,
    serverError,
} from '@/shared/presentation/contracts/http'
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'
import { UserCollectionPresenter } from '../presenters/user-collection.presenter'
import { UsersCollectionView } from '../dtos/users-collection-view'

export namespace ListUsersController {
    export type Body = ListUsersUseCase.Input

    export type Request = HttpRequest<Body>

    export type Response = HttpResponse<UsersCollectionView | null>

    export class Controller implements BaseController {
        constructor(private readonly ListUsers: ListUsersUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { filter, page, perPage, sort, sortDir } = request.body
            const response = await this.ListUsers.execute({
                filter,
                page,
                perPage,
                sort,
                sortDir,
            })

            if (response.isLeft()) {
                return serverError(new Error('Internal Server Error'))
            }

            const userListToPresent = this.toPresentation(response.value)

            return ok(userListToPresent, 201)
        }

        private toPresentation(
            response: ListUsersUseCase.Output,
        ): UsersCollectionView {
            return new UserCollectionPresenter(response).toPresentation()
        }
    }
}
