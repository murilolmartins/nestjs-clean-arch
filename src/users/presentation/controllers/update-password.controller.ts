import {
    HttpError,
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase'

export namespace UpdatePasswordController {
    export type Body = Omit<UpdatePasswordUseCase.Input, 'id'>

    export type Params = Pick<UpdatePasswordUseCase.Input, 'id'>

    export type Request = HttpRequest<Body, Params>
    export type Response = HttpResponse<
        UpdatePasswordUseCase.Output | HttpError
    >

    export class Controller implements BaseController {
        constructor(
            private readonly updatePassword: UpdatePasswordUseCase.UseCase,
        ) {}
        async handle(request: Request): Promise<Response> {
            const { currentPassword, newPassword } = request.body
            const { id } = request.params
            const response = await this.updatePassword.execute({
                currentPassword,
                newPassword,
                id,
            })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            return ok(response.value, 201)
        }
    }
}
