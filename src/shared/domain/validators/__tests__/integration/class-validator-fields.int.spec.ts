import {
    MaxLength,
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    IsEmail,
} from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'
import { faker } from '@faker-js/faker'

class StubRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    price: number

    constructor(data: any) {
        Object.assign(this, data)
    }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
    validate(data: any): boolean {
        return super.validate(new StubRules(data))
    }
}

describe('ClassValidatorFields integration test', () => {
    it('Should return true if validation succeds', () => {
        const sut = new StubClassValidatorFields()

        const data = {
            name: 'any_name',
            email: faker.internet.email(),
            price: 0,
        }

        const isValid = sut.validate(data)

        expect(isValid).toBeTruthy()
        expect(sut.errors).toBeNull()
        expect(sut.validatedData).toStrictEqual(new StubRules(data))
    })

    it('Should return false if validation fails', () => {
        const sut = new StubClassValidatorFields()

        const isValid = sut.validate(null)

        expect(isValid).toBeFalsy()
        expect(sut.errors).toStrictEqual({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ],
            email: [
                'email should not be empty',
                'email must be a string',
                'email must be an email',
            ],
            price: [
                'price should not be empty',
                'price must be a number conforming to the specified constraints',
                'price must not be less than 0',
            ],
        })
        expect(sut.validatedData).toBeNull()
    })
})
