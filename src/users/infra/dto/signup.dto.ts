import { SignUpController } from '@/users/presentation/controllers/signup.controller'
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator'

export class SignupDto implements SignUpController.Body {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @MinLength(8)
    @IsNotEmpty()
    password: string
}
