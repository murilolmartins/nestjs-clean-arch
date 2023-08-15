import {
    HttpError,
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
    export type Response = HttpResponse<UserView | HttpError>

    export class Controller implements BaseController {
        constructor(private readonly updateUser: UpdateUserUseCase.UseCase) {}
        async handle(request: Request): Promise<Response> {
            const { name } = request.body
            const { id } = request.params
            const response = await this.updateUser.execute({ name, id })

            if (response.isLeft()) {
                return error(response.value, response.value.statusCode)
            }

            const userToPresent = new UserPresenter(response.value)

            return ok(userToPresent.toPresentation(), 201)
        }
    }
}
