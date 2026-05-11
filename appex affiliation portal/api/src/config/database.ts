
import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis-mock'
import type { Redis as RedisType } from 'ioredis'

// Database connection
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
})

// Mock Redis connections for local development without actual Redis
export const redis = new Redis() as unknown as RedisType
export const sessionRedis = new Redis() as unknown as RedisType
export const cacheRedis = new Redis() as unknown as RedisType
export const jobRedis = new Redis() as unknown as RedisType

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', database: 'postgresql' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Database health check failed:', error)
    return { status: 'unhealthy', error: errorMessage }
  }
}

// Redis health check
export const checkRedisHealth = async (redisInstance: RedisType, name: string) => {
  try {
    await redisInstance.ping()
    return { status: 'healthy', redis: name }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`${name} health check failed:`, error)
    return { status: 'unhealthy', redis: name, error: errorMessage }
  }
}

// Graceful shutdown
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect()
    await redis.disconnect()
    await sessionRedis.disconnect()
    await cacheRedis.disconnect()
    await jobRedis.disconnect()
    console.log('Database connections closed successfully')
  } catch (error) {
    console.error('Error closing database connections:', error)
  }
}

export { prisma }
export default prisma
