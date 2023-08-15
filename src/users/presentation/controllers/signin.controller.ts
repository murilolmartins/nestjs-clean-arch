import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import {
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { SignInUseCase } from '@/users/application/usecases/signin.usecase'
import { UserView } from '../dtos/user-view'
import { UserPresenter } from '../presenters/user.presenter'

export namespace SignInController {
    export type Body = SignInUseCase.Input

    export type Request = HttpRequest<Body>

    export type Response = HttpResponse<UserView | null>

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

            const userToPresent = this.toPresenter(response.value)

            return ok(userToPresent, 200)
        }

        private toPresenter(response: SignInUseCase.Output): UserView {
            return new UserPresenter(response).toPresentation()
        }
    }
}
