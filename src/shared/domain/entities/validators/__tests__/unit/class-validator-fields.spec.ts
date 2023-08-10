import { ClassValidatorFields } from '../../class-validator-fields'
import * as classValidator from 'class-validator'

class StubClassValidatorFields extends ClassValidatorFields<{
    field: string
}> {}

const spyValidateSync = jest.spyOn(classValidator, 'validateSync')

describe('ClassValidatorFields unit test', () => {
    test("Should instantialize errors and validatedData as null's", () => {
        const sut = new StubClassValidatorFields()

        expect(sut.errors).toBeNull()
        expect(sut.validatedData).toBeNull()
    })
    test('Validate method should return false and set errors if validation fails', () => {
        const sut = new StubClassValidatorFields()

        const data = {
            field: null,
        }

        spyValidateSync.mockReturnValue([
            {
                property: 'field',
                constraints: {
                    isString: 'field must be a string',
                },
            },
        ])
        const isValid = sut.validate(data)

        expect(isValid).toBeFalsy()
        expect(sut.errors).toHaveProperty('field')
        expect(sut.errors.field).toContain('field must be a string')
        expect(sut.validatedData).toBeNull()
        expect(spyValidateSync).toHaveBeenCalled(1)
    })
    test('Validate method should return true and set validatedData if validation succeds', () => {
        const sut = new StubClassValidatorFields()

        const data = {
            field: 'any_value',
        }

        spyValidateSync.mockReturnValue([])

        const isValid = sut.validate(data)

        expect(isValid).toBeTruthy()
        expect(sut.errors).toBeNull()
        expect(sut.validatedData).toStrictEqual(data)
        expect(spyValidateSync).toHaveBeenCalled()
    })
})
