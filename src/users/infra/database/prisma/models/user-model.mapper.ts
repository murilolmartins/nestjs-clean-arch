import { UserEntity } from '@/users/domain/entities/user.entity'
import { User } from '@prisma/client'

export class UserModelMapper {
    static toEntity(user: User) {
        return new UserEntity({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })
    }
}
