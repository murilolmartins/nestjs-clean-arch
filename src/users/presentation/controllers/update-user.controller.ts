import {
    HttpRequest,
    HttpResponse,
    error,
    ok,
} from '@/shared/presentation/contracts/http'
import { Controller as BaseController } from '@/shared/presentation/contracts/controller'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { UserView } from '../dtos/user-view'
import { UserPresenter } from '../presenters/user.presenter'

export namespace UpdateUserController {
    export type Body = Omit<UpdateUserUseCase.Input, 'id'>

    export type Params = Pick<UpdateUserUseCase.Input, 'id'>

    export type Request = HttpRequest<Body, Params>
    export type Response = HttpResponse<UserView | null>

    export class Controller implements BaseController {
        constructor(private readonly updateUser: UpdateUserUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { name } = request.body
            const { id } = request.params
            const response = await this.updateUser.execute({ name, id })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            const userToPresent = this.toPresentation(response.value)

            return ok(userToPresent, 201)
        }

        private toPresentation(response: UpdateUserUseCase.Output): UserView {
            return new UserPresenter(response).toPresentation()
        }
    }
}
