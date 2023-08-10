import { Entity } from '@/shared/domain/entities/entity'

export type UserProps = {
    name: string
    email: string
    password: string
}

export class UserEntity extends Entity<UserProps> {
    constructor(public readonly props: UserProps) {
        super(props)
    }

    static create(props: UserProps): UserEntity {
        return new UserEntity(props)
    }

    updateName(name: string): void {
        this.name = name
    }

    get name(): string {
        return this.props.name
    }

    private set name(name: string) {
        this.props.name = name
    }

    get email(): string {
        return this.props.email
    }

    updatePassword(password: string): void {
        this.password = password
    }

    get password(): string {
        return this.props.password
    }

    private set password(password: string) {
        this.props.password = password
    }
}
