import { UserOutput } from '@/users/application/dto/user-output'
import { UserView } from '../dtos/user-view'
import { formatDateToPtBr } from '@/shared/helpers/format-date-to-pt-br'

export class UserPresenter {
    public readonly id: string
    public readonly name: string
    public readonly email: string
    public readonly createdAt: string
    public readonly updatedAt: string

    constructor(public readonly user: UserOutput) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.createdAt = formatDateToPtBr(user.createdAt)
        this.updatedAt = formatDateToPtBr(user.updatedAt)
    }
    toPresentation(): UserView {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
