import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import {
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { SignupUseCase } from '@/users/application/usecases/signup.usecase'
import { UserView } from '../dtos/user-view'
import { UserPresenter } from '../presenters/user.presenter'

export namespace SignUpController {
    export type Body = SignupUseCase.Input

    export type Request = HttpRequest<Body>

    export type Response = HttpResponse<UserView | null>

    export class Controller implements BaseController {
        constructor(private readonly signUp: SignupUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { name, email, password } = request.body
            const response = await this.signUp.execute({
                name,
                email,
                password,
            })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            const userToPresent = this.toPresentation(response.value)

            return ok(userToPresent, 201)
        }

        private toPresentation(response: SignupUseCase.Output): UserView {
            return new UserPresenter(response).toPresentation()
        }
    }
}
