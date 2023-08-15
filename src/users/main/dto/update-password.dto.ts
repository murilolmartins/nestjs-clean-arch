import { UpdatePasswordController } from '@/users/presentation/controllers/update-password.controller'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdatePasswordDto implements UpdatePasswordController.Body {
    @IsString()
    @IsNotEmpty()
    currentPassword: string

    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    newPassword: string
}
