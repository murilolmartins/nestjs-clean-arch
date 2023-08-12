import { HashProvider } from '@/users/application/providers/hash.provider'
import bcrypt from 'bcryptjs'

export class BcryptHashProvider implements HashProvider {
    async generateHash(payload: string): Promise<string> {
        return bcrypt.hash(payload, 8)
    }
    async compareHash(payload: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(payload, hashed)
    }
}
