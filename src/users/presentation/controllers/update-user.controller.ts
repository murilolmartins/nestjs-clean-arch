import {
    HttpError,
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'

export namespace UpdateUserController {
    export type Body = Omit<UpdateUserUseCase.Input, 'id'>

    export type Params = Pick<UpdateUserUseCase.Input, 'id'>

    export type Request = HttpRequest<Body, Params>
    export type Response = HttpResponse<UpdateUserUseCase.Output | HttpError>

    export class Controller implements BaseController {
        constructor(private readonly updateUser: UpdateUserUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { name } = request.body
            const { id } = request.params
            const response = await this.updateUser.execute({ name, id })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            return ok(response.value, 201)
        }
    }
}
