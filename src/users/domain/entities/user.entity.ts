export type UserProps = {
    name: string
    email: string
    password: string
    createdAd?: Date
}

export class UserEntity {
    constructor(public readonly props: UserProps) {
        this.props.createdAd = this.props.createdAd ?? new Date()
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

    get createdAd(): Date {
        return this.props.createdAd
    }
}
