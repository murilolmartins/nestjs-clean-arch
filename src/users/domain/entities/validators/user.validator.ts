import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator'
import { UserProps } from '../user.entity'
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields'

class UserRules {
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

    constructor({ name, email, password }: UserProps) {
        Object.assign(this, { name, email, password })
    }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
    validate(data: UserProps): boolean {
        return super.validate(new UserRules(data ?? ({} as UserProps)))
    }
}

export class UserValidatorFactory {
    static create(): UserValidator {
        return new UserValidator()
    }
}
