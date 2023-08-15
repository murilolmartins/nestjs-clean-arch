import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserEntity unit tests', () => {
    let props: UserProps
    let sut: UserEntity

    beforeEach(async () => {
        props = UserDataBuilder()

        sut = new UserEntity(props)
    })

    it('Instance class', () => {
        expect(sut.props.name).toEqual(props.name)
        expect(sut.props.email).toEqual(props.email)
        expect(sut.props.password).toEqual(props.password)
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
    })

    it('Update name method', () => {
        const newName = 'new_name'

        UserEntity.validate = jest.fn().mockReturnValue({
            name: newName,
            email: props.email,
            password: props.password,
        })

        sut.updateName(newName)

        expect(sut.name).toEqual(newName)
        expect(UserEntity.validate).toBeCalledTimes(1)
        expect(UserEntity.validate).toBeCalledWith(props)
    })

    it('Update password method', () => {
        const newPassword = 'new_password'

        UserEntity.validate = jest.fn().mockReturnValue({
            name: props.name,
            email: props.email,
            password: newPassword,
        })

        sut.updatePassword(newPassword)

        expect(sut.password).toEqual(newPassword)
        expect(UserEntity.validate).toBeCalledTimes(1)
        expect(UserEntity.validate).toBeCalledWith(props)
    })

    test('Create method', () => {
        UserEntity.validate = jest.fn().mockReturnValue({
            name: props.name,
            email: props.email,
            password: props.password,
        })
        const user = UserEntity.create(props)

        expect(user.isRight()).toBeTruthy()
        expect(user.value).toBeInstanceOf(UserEntity)
        expect(user.isRight() && user.value.email).toEqual(props.email)
        expect(user.isRight() && user.value.name).toEqual(props.name)
        expect(user.isRight() && user.value.password).toEqual(props.password)
        expect(user.isRight() && user.value.id).toBeDefined()
        expect(user.isRight() && user.value.createdAt).toBeInstanceOf(Date)
        expect(user.isRight() && user.value.updatedAt).toBeInstanceOf(Date)
        expect(UserEntity.validate).toBeCalledTimes(1)
        expect(UserEntity.validate).toBeCalledWith(props)
    })
})
