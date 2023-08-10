import crypto from 'node:crypto'

export class UUIDHelper {
    static validate(id: string): boolean {
        return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-5][0-9a-fA-F]{3}-[089abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
            id,
        )
    }

    static generate(): string {
        return crypto.randomUUID()
    }
}
