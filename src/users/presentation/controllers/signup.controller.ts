import { Controller as BaseController } from '@/shared/presentation/controller'
import {
    HttpError,
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/http'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'

export namespace SignUpController {
    export type Body = {
        name: string
        email: string
        password: string
    }

    export type Request = HttpRequest<Body>

    export type Response = HttpResponse<UserOutput | HttpError>

    export class Controller implements BaseController {
        constructor(private readonly signUpUseCase: SignupUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { name, email, password } = request.body
            const response = await this.signUpUseCase.execute({
                name,
                email,
                password,
            })

            if (response.isLeft()) {
                return error(response.value, 400)
            }

            return ok(response.value, 201)
        }
    }
}
