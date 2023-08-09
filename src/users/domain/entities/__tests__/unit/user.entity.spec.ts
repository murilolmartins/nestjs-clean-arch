import { faker } from '@faker-js/faker'
import { UserEntity, UserProps } from '../../user.entity'

describe('UserEntity unit tests', () => {
    let props: UserProps
    let sut: UserEntity

    beforeEach(() => {
        props = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        sut = new UserEntity(props)
    })

    it('Constructor method', () => {
        expect(sut.props.name).toEqual(props.name)
        expect(sut.props.email).toEqual(props.email)
        expect(sut.props.password).toEqual(props.password)
        expect(sut.props.createdAd).toBeInstanceOf(Date)
    })

    it('Name getter', () => {
        expect(sut.name).toBeDefined()
        expect(sut.name).toEqual(props.name)
        expect(typeof sut.name).toBe('string')
    })

    it('Email getter', () => {
        expect(sut.email).toEqual(props.email)
        expect(typeof sut.email).toBe('string')
        expect(sut.email).toBeDefined()
    })

    it('Password getter', () => {
        expect(sut.password).toEqual(props.password)
        expect(typeof sut.password).toBe('string')
        expect(sut.password).toBeDefined()
    })

    it('CreatedAd getter', () => {
        expect(sut.createdAd).toBeDefined()
        expect(sut.createdAd).toBeInstanceOf(Date)
    })
})
