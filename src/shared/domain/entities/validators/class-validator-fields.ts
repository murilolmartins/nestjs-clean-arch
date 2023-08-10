import { validateSync } from 'class-validator'
import { FieldsErrors, ValidatorFields } from './validator-fields.interface'

export abstract class ClassValidatorFields<PropsValidated>
    implements ValidatorFields<PropsValidated>
{
    errors: FieldsErrors = null
    validatedData: PropsValidated = null

    validate(data: any): boolean {
        const errors = validateSync(data)

        if (errors.length) {
            this.errors = errors.reduce((acc, error) => {
                const { property, constraints } = error

                acc[property] = Object.values(constraints)

                return acc
            }, {})
        } else {
            this.validatedData = data
        }

        return !errors.length
    }
}
