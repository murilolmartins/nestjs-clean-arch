import { BcryptHashProvider } from '../../bccrypt-hash.provider'
import bcrypt from 'bcryptjs'

describe('BcryptHashProvider unit tests', () => {
    let sut: BcryptHashProvider

    beforeEach(() => {
        sut = new BcryptHashProvider()
    })

    it('Should return a hashed string', async () => {
        const hashed = await sut.generateHash('any_string')

        expect(hashed).toBeDefined()
        expect(typeof hashed).toBe('string')
        expect(hashed).not.toEqual('any_string')
        expect(bcrypt.compareSync('any_string', hashed)).toBeTruthy()
    })

    it('Should return true if payload and hashed are equal', async () => {
        const hashed = await sut.generateHash('any_string')

        const isValid = await sut.compareHash('any_string', hashed)

        expect(isValid).toBeTruthy()
    })

    it('Should return false if payload and hashed are not equal', async () => {
        const hashed = await sut.generateHash('any_string')

        const isValid = await sut.compareHash('other_string', hashed)

        expect(isValid).toBeFalsy()
    })
})
