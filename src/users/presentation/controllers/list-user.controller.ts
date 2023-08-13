import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import {
    HttpError,
    HttpRequest,
    HttpResponse,
    ok,
    serverError,
} from '@/shared/presentation/contracts/http'
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase'

export namespace ListUsersController {
    export type Body = ListUsersUseCase.Input

    export type Request = HttpRequest<Body>

    export type Response = HttpResponse<ListUsersUseCase.Output | HttpError>

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

            return ok(response.value, 201)
        }
    }
}
