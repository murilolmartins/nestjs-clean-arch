import { Module } from '@nestjs/common'
import { EnvConfigModule } from './shared/infra/env-config/env-config.module'
import { UsersModule } from './users/infra/users.module'
import { DatabaseModule } from './shared/infra/database/database.module'

@Module({
    imports: [EnvConfigModule, UsersModule, DatabaseModule],
})
export class AppModule {}
