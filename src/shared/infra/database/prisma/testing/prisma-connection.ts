import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'

export const prismaConnection = async (): Promise<PrismaClient> => {
    execSync('yarn migrate:test')

    const prisma = new PrismaClient()

    await prisma.$connect()

    return prisma
}
