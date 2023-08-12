import { Entity } from '@/shared/domain/entities/entity'
import { SearchResult } from '@/shared/domain/repositories/searchble-repository-contracts'

export interface PaginationOutput<Items = any> {
    items: Items[]
    total: number
    currentPage: number
    lastPage: number
    perPage: number
}

export class PaginationOutputMapper {
    static toOutput<Items = any>(
        items: Items[],
        searchResult: SearchResult<Entity>,
    ): PaginationOutput<Items> {
        const resultToJson = searchResult.toJSON()

        return {
            items,
            total: resultToJson.total,
            currentPage: resultToJson.currentPage,
            lastPage: resultToJson.lastPage,
            perPage: resultToJson.perPage,
        }
    }
}
