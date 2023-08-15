import {
    SortDirection,
    SortDirectionEnum,
} from '@/shared/domain/repositories/searchble-repository-contracts'
import { ListUsersController } from '@/users/presentation/controllers/list-user.controller'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export class ListUsersDto implements ListUsersController.Body {
    @IsNumber()
    @IsOptional()
    page?: number

    @IsNumber()
    @IsOptional()
    perPage?: number

    @IsString()
    @IsOptional()
    sort?: string

    @IsEnum(SortDirectionEnum)
    @IsOptional()
    sortDir?: SortDirection

    @IsString()
    @IsOptional()
    filter?: string
}
