import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserEntity unit tests', () => {
    let props: UserProps
    let sut: UserEntity

    beforeEach(() => {
        props = UserDataBuilder()

        sut = UserEntity.create(props)
    })

    it('Constructor method', () => {
        expect(sut.name).toEqual(props.name)
        expect(sut.email).toEqual(props.email)
        expect(sut.password).toEqual(props.password)
        expect(sut.createdAt).toBeInstanceOf(Date)
        expect(sut.updatedAt).toBeInstanceOf(Date)
        expect(sut.id).toBeDefined()
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

        console.log(sut.toJSON())
    })

    it('Update name method', () => {
        const newName = 'new_name'

        sut.updateName(newName)

        expect(sut.name).toEqual(newName)
    })

    it('Update password method', () => {
        const newPassword = 'new_password'

        sut.updatePassword(newPassword)

        expect(sut.password).toEqual(newPassword)
    })
})
