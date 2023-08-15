import {
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase'

export namespace GetUserController {
    export type Params = GetUserUseCase.Input

    export type Request = HttpRequest<null, Params>
    export type Response = HttpResponse<GetUserUseCase.Output | null>

    export class Controller implements BaseController {
        constructor(private readonly getUser: GetUserUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { id } = request.params
            const response = await this.getUser.execute({
                id,
            })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            return ok(response.value, 200)
        }
    }
}
