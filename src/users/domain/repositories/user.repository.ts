import { UserEntity } from '../entities/user.entity'
import { SeachRepositoryInterface } from '@/shared/domain/repositories/searchble-repository-contracts'

export interface UserRepository
    extends SeachRepositoryInterface<UserEntity, any, any> {
    findByEmail(email: string): Promise<UserEntity>
    emailExists(email: string): Promise<void>
}
