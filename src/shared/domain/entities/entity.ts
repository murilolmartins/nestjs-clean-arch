import { UUIDHelper } from '../helpers/uuid.helper'

export class Entity<T = any> {
    constructor(
        public readonly props: T,
        public readonly id?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) {
        this.props = props
        this.id = UUIDHelper.validate(id) ? id : UUIDHelper.generate()
        this.createdAt = createdAt || new Date()
        this.updatedAt = updatedAt || new Date()
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
