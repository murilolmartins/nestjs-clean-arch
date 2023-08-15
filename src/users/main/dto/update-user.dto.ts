import { UpdateUserController } from '@/users/presentation/controllers/update-user.controller'
import { IsString, MaxLength } from 'class-validator'

export class UpdateUserDto implements UpdateUserController.Body {
    @MaxLength(255)
    @IsString()
    name?: string
}
