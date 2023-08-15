import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'

export const prismaConnection = (): PrismaClient => {
    execSync('yarn migrate:test')

    const prisma = new PrismaClient()

    return prisma
}
