import crypto from 'node:crypto'

export class Entity<T = any> {
    public readonly id: string
    public readonly createdAt: Date
    public readonly updatedAt: Date

    constructor(public readonly props: T) {
        this.props = props
        this.id = crypto.randomUUID()
        this.createdAt = new Date()
        this.updatedAt = new Date()
    }

    toJSON(): T & { id: string; createdAt: Date; updatedAt: Date } {
        return {
            ...this.props,
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
