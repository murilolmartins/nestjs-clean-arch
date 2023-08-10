import { Entity } from '@/shared/domain/entities/entity'
import { UserValidatorFactory } from './validators/user.validator'
import { EntityValidationError } from '@/shared/domain/errors/validation.error'
import { Either, left, right } from '@/shared/domain/contracts/either'

export type UserProps = {
    name: string
    email: string
    password: string
}

export class UserEntity extends Entity<UserProps> {
    constructor(public readonly props: UserProps) {
        super(props)
    }

    static create(props: UserProps): Either<EntityValidationError, UserEntity> {
        try {
            const validatedProps = UserEntity.validate(props)
            return right(new UserEntity(validatedProps))
        } catch (error) {
            return left(error)
        }
    }

    static validate(props: UserProps): UserProps {
        const validator = UserValidatorFactory.create()

        const isValid = validator.validate(props)

        if (!isValid) {
            throw new EntityValidationError(validator.errors)
        }

        return validator.validatedData
    }

    updatePassword(password: string): Either<EntityValidationError, string> {
        try {
            const validatedProps = UserEntity.validate({
                ...this.props,
                password,
            })
            this.password = validatedProps.password

            return right(this.password)
        } catch (error) {
            return left(error)
        }
    }
    updateName(name: string): Either<EntityValidationError, string> {
        try {
            const validatedProps = UserEntity.validate({
                ...this.props,
                name,
            })
            this.name = validatedProps.name

            return right(this.name)
        } catch (error) {
            return left(error)
        }
    }

    get name(): string {
        return this.props.name
    }

    get email(): string {
        return this.props.email
    }

    get password(): string {
        return this.props.password
    }

    private set name(name: string) {
        this.props.name = name
    }

    private set password(password: string) {
        this.props.password = password
    }
}
