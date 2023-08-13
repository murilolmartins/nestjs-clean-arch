import {
    HttpError,
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import { DeleteUserUseCase } from '@/users/application/usecases/delete-user.usecase'

export namespace DeleteUserController {
    export type Params = DeleteUserUseCase.Input

    export type Request = HttpRequest<null, Params>
    export type Response = HttpResponse<DeleteUserUseCase.Output | HttpError>

    export class Controller implements BaseController {
        constructor(private readonly deleteUser: DeleteUserUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { id } = request.params
            const response = await this.deleteUser.execute({
                id,
            })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            return ok(response.value, 201)
        }
    }
}
