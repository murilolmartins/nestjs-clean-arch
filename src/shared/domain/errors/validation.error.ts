import { FieldsErrors } from '../validators/validator-fields.interface'

export class ValidationError extends Error {}

export class EntityValidationError extends Error {
    statusCode = 400
    constructor(public errors: FieldsErrors) {
        super('Entity validation error')
        this.name = 'EntityValidationError'
    }
}
