import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/psyconnect?schema=public'
process.env.DATABASE_URL = databaseUrl

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
