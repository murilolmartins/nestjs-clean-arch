import { SignInController } from '@/users/presentation/controllers/signin.controller'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SigninDto implements SignInController.Body {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}
