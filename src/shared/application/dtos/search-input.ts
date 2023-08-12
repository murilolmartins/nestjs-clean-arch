import { SortDirection } from '@/shared/domain/repositories/searchble-repository-contracts'

export interface SearchInput<Filter = string> {
    page?: number
    perPage?: number
    sort?: string | null
    sortDir?: SortDirection | null
    filter?: Filter | null
}
