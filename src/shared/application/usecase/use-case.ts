import { Either } from '@/shared/domain/contracts/either'

export interface UseCase<TInput, TOutput> {
    execute(input: TInput): Promise<Either<any, TOutput>>
}
