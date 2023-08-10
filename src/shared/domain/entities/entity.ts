import { UUIDHelper } from '../helpers/uuid.helper'

export class Entity<T = any> {
    public readonly createdAt: Date
    public readonly updatedAt: Date

    constructor(
        public readonly props: T,
        public readonly id?: string,
    ) {
        this.props = props
        this.id = UUIDHelper.validate(id) ? id : UUIDHelper.generate()
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
