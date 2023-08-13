import {
    SortDirection,
    SortDirectionEnum,
} from '@/shared/domain/repositories/searchble-repository-contracts'
import { ListUsersController } from '@/users/presentation/controllers/list-user.controller'
import { IsEnum, IsNumber, IsString } from 'class-validator'

export class ListUsersDto implements ListUsersController.Body {
    @IsNumber()
    page?: number

    @IsNumber()
    perPage?: number

    @IsString()
    sort?: string

    @IsEnum(SortDirectionEnum)
    sortDir?: SortDirection

    @IsString()
    filter?: string
}
