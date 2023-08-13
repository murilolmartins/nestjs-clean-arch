import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import {
    HttpError,
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { SignInUseCase } from '@/users/application/usecases/signin.usecase'

export namespace SignInController {
    export type Body = SignInUseCase.Input

    export type Request = HttpRequest<Body>

    export type Response = HttpResponse<SignInUseCase.Output | HttpError>

    export class Controller implements BaseController {
        constructor(private readonly signIn: SignInUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { email, password } = request.body
            const response = await this.signIn.execute({
                email,
                password,
            })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            return ok(response.value, 200)
        }
    }
}
