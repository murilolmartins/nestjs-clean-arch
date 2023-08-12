import { BcryptHashProvider } from './bccrypt-hash.provider'

export enum HashProviderEnum {
    BCRYPT = 'bcrypt',
}

export const HashProviderMap = {
    [HashProviderEnum.BCRYPT]: new BcryptHashProvider(),
}
