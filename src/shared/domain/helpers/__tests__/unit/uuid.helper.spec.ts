import { UUIDHelper } from '../../uuid.helper'

describe('UUID unit tests', () => {
    describe('validate method', () => {
        it('Should return true if uuid is valid', () => {
            const uuid = 'd0f02a4e-3f7a-4e2f-8b1d-8d5a0f0e9e9a'
            const isValid = UUIDHelper.validate(uuid)
            expect(isValid).toBe(true)
        })
        it('Should return false if uuid is invalid', () => {
            const uuid = 'invalid_uuid'
            const isValid = UUIDHelper.validate(uuid)
            expect(isValid).toBe(false)
        })
        it('Should return false if uuid is null', () => {
            const uuid = null
            const isValid = UUIDHelper.validate(uuid)
            expect(isValid).toBe(false)
        })
        it('Should return false if uuid is undefined', () => {
            const uuid = undefined
            const isValid = UUIDHelper.validate(uuid)
            expect(isValid).toBe(false)
        })
    })

    describe('generate method', () => {
        it('Should return a valid uuid', () => {
            const uuid = UUIDHelper.generate()
            const isValid = UUIDHelper.validate(uuid)
            expect(isValid).toBe(true)
        })
    })
})
